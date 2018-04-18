const express = require("express");
const mongoose = require("mongoose");

const User = require("./auth/UserModel");

mongoose
  .connect('mongodb://localhost/authdb')
  .then(() => {
    console.log("\n=== connected to MongoDB ===\n");
  })
  .catch(err => console.log('database connection failed', err));

const server = express();

const authenticate = function(req, res, next) {
  req.hello = `hello Akiem!`;

  next();
};

server.use(express.json());

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  User
    .findOne({ username })
    .then(user => {
      if (user) {
        user.isPasswordValid(password, cb);
      }
    })
    .catch(err => res.status(500).json(err));
});

server.get("/", (req, res) => {
  res.status(200).json({ api: "running!", greeting: req.hello });
});

server.get("/greet", greeter, (req, res) => {
  res.status(200).json({ api: "running!", greeting: req.hello });
});

server.post("/register", (req, res) => {
  const user = new User(req.body);

  user
    .save()
    .then(savedUser => res.status(200).json(savedUser))
    .catch(err => res.status(500).json(err));
});

server.listen(5000, () => console.log("\n=== api on port 5000 ===\n"));
