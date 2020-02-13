const express = require('express');
const apiRouter = require('./api/api-router');
const server = express();

server.use(express.json());

// /api/api-router
server.use('/api', apiRouter);

server.get('/', (req, res) => {
    res.json({api: 'running on server!'})
})


module.exports = server;