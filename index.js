const express = require('express');

const db = require('./data/db');

const server = express();
server.use(express.json());

const PORT = 8000;

server.get('/', (req, res) => {
  res.send('Sanity Check');
})

server.listen(PORT, () => {
  console.log(`UP and RUNNING on ${PORT}`)
});