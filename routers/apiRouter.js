const express = require('express');

const aRouter = require('./authRouter');

const server = express();

server.use('/', aRouter);

module.exports = router;