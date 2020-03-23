const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");

const UserRouter = require('../users/user-router');
const AuthRouter = require('../auth/auth-router');
const restricted = require('../auth/restricted');

const server = express();

const sessionConfig = {
  name: "monster",
  secret: "keep it secret, keep it safe!",
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false, // true in production to send only over https
    httpOnly: true, // true means no access from JS
  },
  resave: false,
  saveUninitialized: true, // GDPR laws require to check with client
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/users', restricted, UserRouter);
server.use('/api', AuthRouter);

server.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

module.exports = server;