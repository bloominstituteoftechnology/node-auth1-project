const express = require("express"); // remember to install your npm packages
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./src/user.js");
const bcrypt = require("bcrypt");

const server = express();

const authenticate = (req, res, next) => {
  if (req.body.password === "mellon") next();
  else res.status(401).send("Wrong password");
};

server.use(bodyParser.json());

mongoose
  .connect("mongodb://localhost/authdb")
  .then(() => {
    console.log("connected to database");
  })
  .catch(error => {
    console.error("database connection failed");
  });

server.get("/", (req, res, next) => {
  res.send("API running");
});

server.post("/register", (req, res, next) => {
  const user = new User(req.body);

  user
    .save()
    .then(user => res.status(201).send(user))
    .catch(err => res.status(500).send(err));
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server up and running on ${port}`);
});
