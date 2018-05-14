const express = require('express');
const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/authAppdb')
  .then(conn => {
    console.log('\n=== connected to mongodb ===\n');
  })
  .catch(err => console.log ('error connecting to mongodb', err));

  const server = express();

  server.use(express.json());

  server.get('/', (req, res) => {
    res.send({ route: '/', message: req.message });
  });

  server.listen(5000, () => console.log('\n=== api running on port 5000 ===\n'));