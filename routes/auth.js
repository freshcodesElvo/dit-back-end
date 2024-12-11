const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const dotenv = require('dotenv');

async function verifyEmail(email) {
    const url = `https://api.zerobounce.net/v2/validate?api_key=${process.env.ZEROBOUNCE_API_KEY}&email=${email}`;
    try {
        const response = await axios.get(url);
        console.log('Email verification response:', response.data); // Log the response
        return response.data;
    } catch (error) {
        console.error('Error verifying email:', error);
        return null;
    }
}


// User Registration
router.post('/register', async (req, res) => {
    const { firstName, secondName, username, email, password } = req.body;

    try {
        const emailVerification = await verifyEmail(email);
        if (!emailVerification || emailVerification.status !== 'valid') {
            return res.status(400).json({ message: 'Invalid or undeliverable email address' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ firstName, secondName, username, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// User Login

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        console.log('User found:', user);

        const validPassword = await bcrypt.compare(password, user.password);
        console.log('Plain password provided:', password);
        console.log('Stored hashed password:', user.password);
        console.log('Password comparison result:', validPassword);

        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        res.header('Authorization', token).json({ message: 'Logged in successfully', token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;







