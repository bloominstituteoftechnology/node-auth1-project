const express = require('express');
const helmet = require('helmet');

const aRoute = require('./routers/authRouter');

const server = express();

server.use(express.json());
server.use(helmet());

server.use('/api/register', aRoute);
server.use('/api/login', aRoute);

server.get('/', (req, res) => {
  res.send(`
    <h2>Fuzzy Raiders</h2>
    <p>Server is running!</p>
    `)
});

module.exports = server;