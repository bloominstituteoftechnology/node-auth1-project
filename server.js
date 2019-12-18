const express = require("express");
const server = express();
const session = require("express-session");
const cors = require("cors");

// Users Router
const usersRouter = require("./users/usersrouter.js");

// Register Router
const registerRouter = require("./register/registerRouter");

// Login User
const loginRouter = require("./login/loginRouter.js");

// Logout User
const logout = require("./logout/logoutRouter.js");

server.use(express.json());
server.use(cors());

server.use(
  session({
    name: "notsession",
    secret: "nobody tosses a dwarf!",
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: true,
      httpOnly: true
    },
    resave: false,
    saveUninitialized: false
  })
);

server.use("/api/users", usersRouter);
server.use("/api/register", registerRouter);
server.use("/api/login", loginRouter);
server.use("/api/logout", logout);

server.get("/", (req, res) => {
  res.send("<h1>Welcome</h1>");
});

module.exports = server;
