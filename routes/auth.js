const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User Registration
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);  // Hash the password with bcrypt
        console.log('Generated hashed password for registration:', hashedPassword);
        const user = new User({ username, password: hashedPassword, email });
        //const user = new User({ username, password, email });
        await user.save();

        console.log('User registered:', user);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: err.message });
    }
});

// User Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found with username:', username);
            return res.status(400).json({ message: 'Invalid username' });
        }

        console.log('User found:', user);
        console.log('Provided password:', password);
        console.log('Stored hashed password:', user.password);

        // Verify the password using bcrypt
        const validPassword = await bcrypt.compare(password, user.password);
        console.log('Password comparison result:', validPassword);

        if (!validPassword) {
            console.log('Password mismatch for username:', username);
            return res.status(400).json({ message: 'Invalid password' });
        }

        if (!process.env.TOKEN_SECRET) {
            console.error('TOKEN_SECRET is not defined in environment variables');
            return res.status(500).json({ message: 'Internal server error' });
        }

        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        console.log('Generated Token:', token);

        res.header('Authorization', token).json({ message: 'Logged in successfully', token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
