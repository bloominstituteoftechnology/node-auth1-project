const express = require('express');
const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/authdb')
  .then(conn => {
    console.log('\n=== connected to mongo ===\n')
  })
  .catch(err => console.log("error connecting to mongo", err));

const server = express();

function authenticate(req, res, next) {
  if(req.body.password === 'infinity') {
    next();
} else {
  res.status(401).send('Sorry bub. Wrong password.');
  }
}

server.use(express.json());

server.get('/', (req, res) => {
  res.send({ route: '/', message: req.message });
});

server.post('/api/login', authenticate, (req, res) => {
  res.send('Welcome to the Mines of Moria!');
});

server.listen(8000, () => console.log('\n=== api running on db ===\n'))