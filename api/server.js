const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
// const session = require('express-session');
// const KnexSessionStore = require('connect-session-knex')(session); //require is a function and can be invoked. K because its constructor. PERSIST TO AVOID LOSS DUE TO EXPRESS RELOAD




const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
// server.use(session(sessionConfig))



server.get('/', (req, res) => {
    res.json({ api: 'Fire up server' });
  });


module.exports = server;