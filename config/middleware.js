const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

module.exports = server =>{
    server.use(express.json());
    server.use(cors());
    server.use(helmet())
    return server;
}