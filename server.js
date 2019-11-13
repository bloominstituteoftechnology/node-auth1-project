const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');

const userRouter = require('./users/user-router.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use(session({
    name: 'user_session',
    secret: 'four score and seven JS errors ago...',
    cookie: {
        maxAge: 24 * 3600 * 1000,
        secure: false,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: true
}));

server.use('/api', userRouter);

module.exports = server; 
