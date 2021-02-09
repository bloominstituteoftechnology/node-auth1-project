const express = require('express');
const morgan = require('morgan');
const server = express();
const logger = require('morgan');

server.get('/', (req, res)=>{
    res.status(200).json({message: `Hello from the root`});
})


module.exports = server;