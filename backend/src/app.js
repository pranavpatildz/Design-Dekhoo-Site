const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/database');

// Connect to database
connectDB();

const app = express();

// Init Middleware
app.use(helmet()); // Apply basic security headers

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Allow only the frontend to connect
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json({ extended: false }));


app.get('/', (req, res) => {
  res.json({ msg: 'Server is running' });
});

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));

module.exports = app;
