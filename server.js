const express = require("express");

// Users Router
const usersRouter = require("./users/usersrouter.js");

// Register Router
const registerRouter = require("./register/registerRouter");

// Login User
const loginRouter = require("./login/loginRouter.js");

server = express();
server.use(express.json());

server.use("/api/users", usersRouter);
server.use("/api/register", registerRouter);
server.use("/api/login", loginRouter);

server.get("/", (req, res) => {
  res.send("<h1>Welcome</h1>");
});

module.exports = server;
