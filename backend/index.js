// Package imports
const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');

// Local imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// .env initialization
dotenv.config();

// Server initialization
const server = express();

// Default middleware
server.use(express.json());
server.use(helmet());
server.use(cors());

// Routes
server.use('/api/auth', authRoutes);
server.use('/api/users', userRoutes);

// Read PORT
const port = process.env.PORT || 1234;

// Server start
server.listen(port, _ => {
    console.log(`Authentication API listening on port ${port}.`);
});
