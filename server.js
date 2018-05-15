const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");

const server = express();
const User = require("./user");

//connect to db
mongoose
  .connect("mongodb://localhost/authdb")
  .then(conn => {
    console.log("\n=== connected to mongo ====\n");
  })
  .catch(err => console.log("error connecting to mongo", err));

//middleware
server.use(helmet());
server.use(express.json());

//routes

// server.use(greet);
server.use(express.json());

server.get("/", (req, res) => {
  res.send({ route: "/", message: req.message });
});

server.post("/api/register", function(req, res) {
  const user = new User(req.body);

  user
    .save()
    .then(user => res.status(201).send(user))
    .catch(err => res.status(500).send(err));
});

server.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }).then(user => {
    if (user) {
      user
        .isPasswordValid(password)
        .then(isValid => {
          if (isValid) {
            res.send("login successful");
          } else {
            res.status(401).send("invalid credentials");
          }
        })
        .catch(err => res.send(err));
    }
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () =>
  console.log(`\n\nAPI running on http://localhost:${port}`)
);
