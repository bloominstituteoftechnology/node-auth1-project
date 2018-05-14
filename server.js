const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");

const server = express();

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

//auth function
function authenticate(req, res, next) {
  if (req.body.password === "mellon") {
    next();
  } else {
    res.status(401).send("You shall not pass!!!");
  }
}

//routes

// server.use(greet);
server.use(express.json());

server.get("/", (req, res) => {
  res.send({ route: "/", message: req.message });
});

server.post("/register", function(req, res) {
  const user = new User(req.body);

  user
    .save()
    .then(user => res.status(201).send(user))
    .catch(err => res.status(500).send(err));
});

server.post("/login", authenticate, (req, res) => {
  res.send("Welcome to the Mines of Moria");
});

const port = process.env.PORT || 5000;
server.listen(port, () =>
  console.log(`\n\nAPI running on http://localhost:${port}`)
);
