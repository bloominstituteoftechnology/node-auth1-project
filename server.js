const express = require('express');
const mongoose = require('mongoose');

server.use(express.json())

mongoose
  .connect('mongodb://localhost/authdb')
  .then(conn => {
    console.log('connected to database');
  })
  .catch(err => console.log('error connecting to database', err));

  server.get('/', (req, res) => {
    res.status(200).json({ api: 'running' });
  });

  const port = process.env.PORT || 5000;
  server.listen(port, () => console.log(`\n=== API up on port: ${port} ===\n`));