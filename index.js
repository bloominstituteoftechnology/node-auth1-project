const express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    users = require('./api/users'),
    auth = require('./api/auth');

const app = express();

app
    .use(
        session({
            secret: 'try to stop me now',
            cookie: {
                maxAge: 1 * 24 * 60 * 60 * 1000,
                // secure: true
            },
            httpOnly: true,
            resave: false,
            saveUninitialized: false
        })
    )
    .use(bodyParser.json())
    .use('/users', users)
    .use('/auth', auth);


app.listen(5000);