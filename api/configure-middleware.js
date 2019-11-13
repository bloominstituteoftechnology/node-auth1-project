const express = require("express");
const helmet = require("helmet");
const session = require("express-session");

const sessionConfig = {
  name: "monkey", //`${username}`
  secret: "keep it secret", // `${password}`
  cookie: {
    maxAge: 1000 * 30,
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false
};

module.exports = server => {
  server.use(express.json());
  server.use(helmet());
  server.use(session(sessionConfig));
};
