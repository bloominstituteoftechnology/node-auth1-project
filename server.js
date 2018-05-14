const mongoose = require('mongoose');
const express = require('express');

const User = require('./users/User');

mongoose.connect("mongodb://localhost/auth")
  .then(() => console.log("\n=== Database Connected ===\n"))
  .catch(err => console.log("\n*** No Connection to Database ***\n"));

const server = express();

server.use(express.json());

server.get('/', (req, res) => res.send("API Connected"));

server.post('/register', (req, res) => {
  const user = new User(req.body);
  user.save()
    .then(user => res.status(201).json(user))
    .catch(err => res.status(500).json(err));
})

server.listen(5000, () => console.log("\n=== Server Active on Port 5000 ===\n"));