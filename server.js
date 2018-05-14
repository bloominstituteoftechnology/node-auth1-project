const mongoose = require('mongoose');
const express = require('express');

mongoose.connect("mongodb://localhost/auth")
  .then(() => console.log("\n=== Database Connected ===\n"))
  .catch(err => console.log("\n*** No Connection to Database ***\n"));

const server = express();

server.use(express.json());

server.get('/', (req, res) => res.send("API Connected"));


server.listen(5000, () => console.log("\n=== Server Active on Port 5000 ===\n"));