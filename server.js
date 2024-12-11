const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Import Routes
const authRoute = require('./routes/auth');
const propertiesRoute = require('./routes/properties');

// Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/properties', propertiesRoute);

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send('Welcome to the Rental Chatbot API');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
