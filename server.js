const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const authRoute = require('./routers/authRouter.js');
const configuredKnex = require('./data/dbConfig.js');

const server = express();

const sessionConfig = {
  name: 'flibbertigibbet',
  secret: 'why do I need this?',
  cookie: {
    maxAge: 1000 * 60 * 360,
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    knex: configuredKnex,
    tablename: 'sessions',
    createtable: true,
    clearInterval: 1000 * 60 * 360
  })
};

server.use(express.json());
server.use(helmet());
server.use(session(sessionConfig));

server.use('/api/auth', authRoute);

server.get('/', (req, res) => {
  res.send(`
    <h2>Fuzzy Raiders</h2>
    <p>Server is running!</p>
    `)
});

module.exports = server;