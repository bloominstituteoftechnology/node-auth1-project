const express = require('express');
// const knex = require('knex')
// const knexConfig = require('./knexfile.js')
// const db = knex(knexConfig.development)
const server = express();

server.get('/', (req, res) => {
  res.send("hello")
})

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
