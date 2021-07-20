const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const server = express();
const session = require( "express-session")

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use(session({
  name: 'chocolatechip',
  secret: 'keep it secret', // .env file
  cookie: {
    maxAge: 1000 * 80 * 80,
    secure: false, 
    httpOnly: false, 
  },
  resave: false, 
  saveUninitialized: false, 
}))



server.get("/", (req, res) => {
  res.json({ api: "Are we there yet?" });
});

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
