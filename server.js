const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const sessions = require('express-session')
const authRouter = require('./users/users-router.js');


const server = express();

const sessionConfiguration ={
  name: 'ohfosho',
  secret: 'keeps it secret, keep it safe',
  cookies: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
    secure: false,
  },
  resave: false,
  saveUninitialized: false,
}

server.use(sessions(sessionConfiguration));

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/auth', authRouter);


server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;
