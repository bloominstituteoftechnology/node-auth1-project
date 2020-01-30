const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");

const sessionConfig = {
    name: 'sprinkles',
    secret: 'keep it secret, keep it safe',
    cookie: {
        maxAge: 1000 * 30,
        secure: false, 
        httpOnly: true,
    },
    resave: false,
    saveUnitialized: false,
}

module.exports = function(server) {
    server.use(helmet());
    server.use(session(sessionConfig))
    server.use(express.json());
    server.use(cors());
};