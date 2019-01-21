// Imports
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');

// Config
const config = server => {
  server.use(morgan('dev'));
  server.use(helmet());
  server.use(express.json());
};

// Export
module.exports = config;