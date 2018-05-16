const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

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
    store: new MongoStore ({
        url: 'mongodb://localhost/sessions',
        ttl: 60 * 20,
    })
};

module.exports = sessionConfig;