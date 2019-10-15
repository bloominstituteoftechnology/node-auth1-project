const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const sessions = require('express-session');

const db = require('./data/db-config');

const UsersRouter = require('./users/users-router');

const sessionConfig = {
    name: 'dogfather',
    secret: 'Dog spells God backwards.',
    cookie: {
        httpOnly: true, // No cookies in JS for security reasons
        maxAge: 1000 * 60 * 60, // Cookie only valid for 1 hour
        secure: false, // Change to "true" during production
    },
    resave: false, // To prevent excessive churning
    saveUninitialized: true, // False during production (or you get sued)
};

const server = express();

server.use(sessions(sessionConfig));
server.use(helmet());
server.use(express.json());
sessionConfig.use(cors());

server.use('/api/users', UsersRouter)

module.exports = server;