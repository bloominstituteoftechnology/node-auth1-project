const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser')

module.exports = server => {
  server.use(helmet());
  server.use(cookieParser())
  server.use(express.json());
  server.use(morgan('dev'));
}