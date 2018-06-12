// Modules
const express = require('express');
const server = express();
const mongoose = require('mongoose');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');
const port = process.env.PORT || 5000;

// Routes
const registerController = require('./auth/register/registerController.js');
const loginController = require('./auth/login/loginController.js');
const logoutController = require('./auth/logout/logoutController.js');
const userController = require('./data/user/userController.js');

// Global Middleware
server.use(helmet());
server.use(cors());
server.use(express.json());

const sessionOptions = {
    secret: 'keep it secret, keep it safe',
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    httpOnly: true,
    secure: false,
    resave: true,
    saveUninitialized: false,
    name: 'nonno'
}
server.use(session(sessionOptions));

// Endpoints
server.use('/register', registerController);
server.use('/login', loginController);
server.use('/logout', logoutController);
server.use('/api/users', userController);

// Mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/auth-i').then(() => {
    console.log('\n *** Connected to our Mongo DB *** \n');
}).catch(err => console.log(err));

server.listen(port, () => console.log(`\n === API running on http://localhost:${port} ===\n`));



