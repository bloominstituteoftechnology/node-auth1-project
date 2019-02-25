const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const server = express();
const authRoutes = require('./routes/authRoutes');

server.use(logger());
server.use(helmet());
server.use(express.json());

server.use('/api', authRoutes);

module.exports = server;
