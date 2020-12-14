const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');

const KnexSessionStore = require('connect-session-knex')(session);

const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');

const server = express();

const config = {
  name: 'sugarPops',
  secret: 'Gotta be fresh',
  cookie: {
    maxAge: 1000 * 60 * 60,
    sercure: false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    knex: require('./../database/connection'),
    tablename: 'sessions',
    sidfieldname: 'session_id',
    createtable: true,
    clearInterval: 1000 * 60 * 60,
  }),
};

server.use(session(config));
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ message: 'Good Morning Sunshine.' })
})

module.exports = server;