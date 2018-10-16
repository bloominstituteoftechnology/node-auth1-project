const helmet = require('helmet');
const express = require('express');
const routes = require('../routes/routes.js');
const session = require('express-session');

const sessionConfig = {
    name: 'notsession',
    secret: 'got treasures in my mind',
    cookie:{
        maxAge: 1 * 60 * 1000,
        secure: false
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false
};

module.exports = server => {
    server.use(helmet());
    server.use(express.json());
    server.use(session(sessionConfig));
    server.use('/', routes);
}