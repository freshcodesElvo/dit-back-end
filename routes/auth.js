const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User Registration
router.post('/register', async (req, res) => {
    const { firstName, secondName, username, email, password} = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);  // Hash the password with bcrypt
        console.log('Generated hashed password for registration:', hashedPassword);
        const user = new User({ firstName,secondName, username,  email, password: hashedPassword  });
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







