const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser')

module.exports = {
  configureMiddleware: server => {
    server.use(helmet());
    server.use(cookieParser())
    server.use(express.json());
    server.use(morgan('dev'));

  },
  protected: (req, res, next) => {
    if (req.session && req.session.user) {
      next();
    } else {
      res.status(401).json({message: 'Session id not found. Please login.'})
    }
  }
}