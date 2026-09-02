const Property = require('../models/Property');
const Favorite = require('../models/Favorite');

exports.getProperties = async (req, res) => {
    try {
        const { city, type, minPrice, maxPrice, status } = req.query;
        const filter = { approved: true };
        if (city) filter.city = city;
        if (type) filter.type = type;
        if (status) filter.status = status;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        const properties = await Property.find(filter).populate('user', 'fullName email').sort({ createdAt: -1 });
        res.json({ success: true, count: properties.length, data: properties });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('user', 'fullName email phone');
        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }
        res.json({ success: true, data: property });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createProperty = async (req, res) => {
    try {
        req.body.user = req.user.id;
        if (req.user.role === 'admin' || req.user.role === 'agent') {
            req.body.approved = true;
        }
        const property = await Property.create(req.body);
        res.status(201).json({ success: true, data: property });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateProperty = async (req, res) => {
    try {
        let property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }
        if (property.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: property });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }
        if (property.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        await property.deleteOne();
        res.json({ success: true, message: 'Property deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.toggleFavorite = async (req, res) => {
    try {
        const existing = await Favorite.findOne({ user: req.user.id, property: req.params.id });
        if (existing) {
            await existing.deleteOne();
            return res.json({ success: true, message: 'Removed from favorites' });
        }
        await Favorite.create({ user: req.user.id, property: req.params.id });
        res.json({ success: true, message: 'Added to favorites' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};