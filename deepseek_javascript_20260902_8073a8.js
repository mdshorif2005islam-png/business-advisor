const API_URL = 'http://localhost:5000/api';

const api = {
    register: async (data) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    login: async (data) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    getMe: async (token) => {
        const res = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return res.json();
    },
    getProperties: async (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        const res = await fetch(`${API_URL}/properties?${params}`);
        return res.json();
    },
    getProperty: async (id) => {
        const res = await fetch(`${API_URL}/properties/${id}`);
        return res.json();
    },
    createProperty: async (data, token) => {
        const res = await fetch(`${API_URL}/properties`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    toggleFavorite: async (id, token) => {
        const res = await fetch(`${API_URL}/properties/${id}/favorite`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return res.json();
    }
};

const storage = {
    setToken: (t) => localStorage.setItem('token', t),
    getToken: () => localStorage.getItem('token'),
    removeToken: () => localStorage.removeItem('token'),
    setUser: (u) => localStorage.setItem('user', JSON.stringify(u)),
    getUser: () => JSON.parse(localStorage.getItem('user')),
    removeUser: () => localStorage.removeItem('user')
};