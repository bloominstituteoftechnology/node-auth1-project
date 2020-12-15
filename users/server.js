require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const server = express();
const session = require("express-session");
const protected = require("../users/middleware");

const UsersRouter = require("../users/user-router");
const AuthRouter = require("../users/authRouter");

const sessionConfiguration = {
  name: "monkey",
  secret: "It's a secret!",
  cookie: {
    httpOnly: true, // means JS cannot access the cookie
    maxAge: 1000 * 60 * 10, // expires after
    secure: false, // send cookies over https only
  },
  resave: false, // re save the session info even if there are no changes
  saveUninitialized: true,
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfiguration));
server.use("/users", protected, UsersRouter);
server.use("/auth", AuthRouter);
server.get("/", (req, res) => {
  res.status(200).json({ Data: "Up and running!" });
});

module.exports = server;