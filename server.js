const express = require('express');

const session = require('express-session')
const connectSessionKnex = require('connect-session-knex')

const db = require('./data/dbConfig')
const authRouter = require('./data/auth-router');
const users= require('./data/users');

const server = express();

const KnexSessionStore= connectSessionKnex(session);

const sessionConfig= {
  name: 'empty brain',
  secret: 'aaaaaahhhhhhhh',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: true 
  },
  resave: false,
  saveUninitialized: false,

  store: new KnexSessionStore({
    knex: db,
    tablename: 'sessions', 
    sidfieldname: 'sid', 
    createtable: true,
    clearInterval: 1000* 60 * 60
  })
}


server.use(express.json());
server.use(session(sessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/users', users);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;
