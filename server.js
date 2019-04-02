const express = require('express');
const helmet = require('helmet');

const aRoute = require('./routers/apiRouter');

const server = express();

server.use(express.json());
server.use(helmet());

server.use('/api', apiRoute);

server.get('/', (req, res) => {
  res.send(`
    <h2>Fuzzy Raiders</h2>
    <p>Server is running!</p>
    `)
});

module.exports = server;