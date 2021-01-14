const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');

const authRouter = require('./auth/router');

const server = express();

// GLOBAL MIDDLEWARE //
server.use(session({
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 *7,
        secure: process.env.SECURE_COOKIE || false,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: process.env.USER_ALLOWED_COOKIEs || true,
    name: "auth1",
    secret: process.env.COOKIE_SECRET || "keep it safe, keep it secret"
}));

server.use(helmet());
server.use(cors());
server.use(express.json());

// ROUTERS //
server.use('/api/auth', authRouter);

server.get('/api', (req, res) => {
    res.status(200).json({
        message: "API up"
    })
})

module.exports = server;