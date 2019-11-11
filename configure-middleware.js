const express = require('express');
const helmet = require('helmet');

module.exports = server => {
  server.use(helmet());
  server.use(express.json());
};