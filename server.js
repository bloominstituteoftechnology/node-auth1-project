// Modules
const express = require('express');
const server = express();
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const port = process.env.PORT || 5000;

// Routes
const registerController = require('./data/register/registerController.js');
const loginController = require('./data/login/loginController.js');
const userController = require('./data/user/userController.js');

// Global Middleware
server.use(helmet());
server.use(cors());
server.use(express.json());

// API Endpoints
server.use('/api/register', registerController);
server.use('/api/login', loginController);
server.use('/api/users', userController);

// Mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/auth-i').then(() => {
    console.log('\n *** Connected to our Mongo DB *** \n');
}).catch(err => console.log(err));

server.listen(port, () => console.log(`\n === API running on http://localhost:${port} ===\n`));



