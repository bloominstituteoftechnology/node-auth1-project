const express = require('express');
const mongoose = require('mongoose');
const server = express();

mongoose
  .connect('mongodb://localhost/auth')
  .then(connected => console.log("connected to mongo"))
  .catch(error => console.log("error connecting to mongo"))

server.use(express.json())

server.get('/', (req, res) => res.send("server is running"))

server.listen(5000, () => console.log("server is listening on port 5k"))