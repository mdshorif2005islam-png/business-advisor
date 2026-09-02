const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    type: { type: String, required: true, enum: ['Apartment', 'House', 'Land', 'Commercial'] },
    status: { type: String, required: true, enum: ['sale', 'rent'] },
    location: { type: String, required: true },
    city: { type: String, required: true },
    meta: { type: String },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    images: [{ type: String }],
    featured: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    approved: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', PropertySchema);