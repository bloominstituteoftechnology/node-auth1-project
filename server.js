const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/authdb').then(conn => {console.log('\n=== connected to mongo ===\n')}).catch(err => console.log("error connecting to mongo", err));

const server = express();

function greet(req, res, next) {
  req.message = "Hello world";

  next();
}

server.use(greet);

server.get('/', (req, res) => {
  res.send({ route: '/', message: req.message });
});

server.get('/hello', (req, res) => {
  res.send({ route: 'hello', message: req.message });
});

server.listen(8000, () => console.log('\n=== api running on db ===\n'))