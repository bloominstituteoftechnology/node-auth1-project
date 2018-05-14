const express = require('express');
const mongoose = require('mongoose');
const Port = 8000;

mongoose
  .connect('mongodb://localhost/authdb')
  .then(conn => {
    console.log('\n=== connected to mongo ===\n');
  })
  .catch(err => console.log('error connecting to mongo', err));

const server = express();

server.get('/', (req, res) => {
  res.send({ api: 'running' });
});

server.listen(Port, () =>
  console.log(`\n=== api running on port ${Port} ===\n`)
);
