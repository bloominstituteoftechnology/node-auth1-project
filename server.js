const express = require('express');
const helmet = require('helmet');
const session = require('express-session');

const authRoute = require('./routers/authRouter')

const server = express();

server.use(express.json());
server.use(helmet());

server.use('/api/auth', authRoute);

server.get('/', (req, res) => {
  res.send(`
    <h2>Fuzzy Raiders</h2>
    <p>Server is running!</p>
    `)
});

module.exports = server;