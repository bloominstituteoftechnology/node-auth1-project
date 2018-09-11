const express = require('express');
const server = express();
const session = require('express-session');
const kss = require('connect-session-knex')(session);

server.use(express.json());
server.use(
  session({
    name: 'serv.ses',
    secret: 'what goes here? [launch codes]',
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: false
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    store: new kss({
      tablename: 'sessions',
      sidfieldname: 'sid',
      knex: require('knex')(require('./knexfile').development),
      createtable: true,
      clearInterval: 60 * 60 * 1000
    })
  })
);
server.use('/api', require('./api'));

const port = 8000;
server.listen(port, () => `Server listening on port ${port}.`);
