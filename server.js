const express = require("express");

const server = express();
server.use(express.json());
const RegisterRouter = require("./register/register-router");
const LoginRouter = require("./login/login-router");
const UsersRouter = require("./users/users-router");

server.get("/", (req, res) => {
  res.json({
    message: "yay"
  });
});

server.use("/api/register", RegisterRouter);
server.use("/api/login", LoginRouter);
server.use("/api/users", UsersRouter);
module.exports = server;
