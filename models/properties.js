const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    description: { type: String, required: true },
    images: [String],
    owner_contact_info: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true }
    },
    availability: { type: String, default: 'available' }
});

module.exports = mongoose.model('Property', PropertySchema);
