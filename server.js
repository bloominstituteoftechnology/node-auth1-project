const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/LoginDB").then(() => {
  console.log("Connected to the database");
});

const registerRouter = require("./Routers/registerRouter");
const loginRouter = require("./Routers/loginRouter");
const usersRouter = require("./Routers/usersRouter");

const server = express();

//express.session options
server.use(
  session({
    secret: "The dawn of day is a ways away, and yet draws ever nearer.",
    cookie: {
      maxAge: 900000 //15 min
    },
    httpOnly: true,
    secure: false,
    resave: true,
    saveUninitialized: false,
    name: "noname"
  })
);

server.use(express.json());
server.use("/api", registerRouter, loginRouter, usersRouter);

server.get("/", (req, res) => res.send("API is running..."));

server.listen(5000, () => {
  console.log("Server is listening at port 5000");
});
