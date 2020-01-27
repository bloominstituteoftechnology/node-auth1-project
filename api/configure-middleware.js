const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

module.exports = server => {
  server.use(helmet());
  server.use(express.json()); 
  server.use(cookieParser());
  server.use(cors());
};
