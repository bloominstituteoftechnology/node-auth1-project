const express = require('express');
const cors = require('cors');
const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);

const server = express();
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send("Hello!");
})

server.listen(3000, () => {
  console.log("Server started on port 3000.");
})