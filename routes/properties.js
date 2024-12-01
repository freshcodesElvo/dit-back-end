const router = require('express').Router();
const Property = require('../models/properties');
const auth = require('../middlewares/auth');

// Add New Property
router.post('/', auth, async (req, res) => {
    const property = new Property(req.body);
    try {
        await property.save();
        res.status(201).json({ message: 'Property added successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get All Properties
router.get('/', async (req, res) => {
    try {
        const properties = await Property.find();
        res.json(properties, "all properties");
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Property by ID
router.get('/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: 'Property not found' });
        res.json(property);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Property
router.put('/:id', auth, async (req, res) => {
    try {
        const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!property) return res.status(404).json({ message: 'Property not found' });
        res.json({ message: 'Property updated successfully', property });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete Property
router.delete('/:id', auth, async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.params.id);
        if (!property) return res.status(404).json({ message: 'Property not found' });
        res.json({ message: 'Property deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
