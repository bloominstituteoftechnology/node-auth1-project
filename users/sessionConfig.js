const session = require('express-session');

const sessionConfig = {
    secret: 'everyone likes cake!',
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000,
    },
    httpOnly: true,
    secure: false,
    resave: true,
    saveUninitialized: false,
    name: 'bluebird',
};

module.exports = sessionConfig;