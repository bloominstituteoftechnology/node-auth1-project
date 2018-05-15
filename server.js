const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const usersRouter = require("./users/usersRouter");
const registerRouter = require("./register/registerRouter");
const loginRouter = require("./login/loginRouter");

const server = express();

server.use(express.json());
server.use(
  session({
    secret: "bestkeptsecret",
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000
    },
    resave: false,
    saveUninitialized: false,
    name: "authlol"
  })
);

mongoose
  .connect("mongodb://localhost/authdb")
  .then(connect => {
    console.log("\n== Connected to AuthDB ==\n");
  })
  .catch(error => console.log("Error connecting to AuthDB.", error));

server.use("/api/users", usersRouter);
server.use("/api/register", registerRouter);
server.use("/api/login", loginRouter);

server.get("/", (req, res) => {
  res.send("--- API is Running ---");
});

server.listen(5000, () => console.log("\n== API running on port 5000 ==\n"));
