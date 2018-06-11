const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/auth-i').then(() => {
  console.log('\n*** Connected to database ***\n');
});

const server = express();

server.use(express.json());

server.listen(5000, () => {
  console.log('\n*** API running on port 8K ***\n');
});