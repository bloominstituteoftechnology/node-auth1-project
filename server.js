const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const Users = require('./users/user-route');

const server = express();

const session = require("express-session");
const KnexSessionsStore = require("connect-session-knex")(session);
const knexConfig = require("./data/db-config");

const sessionConfiguration = {
  name: "hai",
  secret: "not for you",
  cookie: {
      httpOnly: false,
      maxAge: 1000 * 60 * 60,
      secure: false
  },
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionsStore({
      knex: knexConfig,
      createtable: true,
      clearInterval: 1000 * 60 * 30

  })
}

server.use(helmet());
server.use(session(sessionConfiguration));
server.use(express.json());
server.use(cors());

server.use('/api/', Users)

server.get('/', (req, res) => {
  res.send("Welcome to the default zone!");
});

module.exports = server;