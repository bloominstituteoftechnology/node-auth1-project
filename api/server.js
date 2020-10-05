const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const errorHandler = require('../api/errorHandler');
const session = require('express-session');

const userRouter = require('../users/user-router')
const authRouter = require('../auth/auth-router')

const server = express();

const sessionConfig = {
  name: "kcookie",
  secret: "this is a secret",
  cookie: {
    maxAge: 60*60*1000,
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false
}

server.use(session(sessionConfig));
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/users", userRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
    res.json({ api: "up and running" });
  });

server.use(errorHandler);

module.exports = server;