// Imports
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const session = require('express-session');
const cors = require('cors');

const sessionConfig = {
  name: 'test',
  secret: 'dadklamkfmkfkawdjkajwandijawudniuawnfaond',
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    secure: false
  },
  httpOnly: true,
  resave: false,
  saveUninitialized: false
};

// Config
const config = server => {
  server.use(morgan('dev'));
  server.use(helmet());
  server.use(session(sessionConfig));
  server.use(express.json());
  server.use(cors());
};

// Export
module.exports = config;
