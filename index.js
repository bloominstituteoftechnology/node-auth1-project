// Base requirements
const express = require('express');
const knex = require('knex');

// Server requirements
const server = express();
const dbConfig = require('./knexfile');
const db = knex(dbConfig.development);
const PORT = 5454;


/* ---------- Endpoints ---------- */


/* ---------- Listener ---------- */
server.listen( PORT, () => {
  console.log(`\n=== Web API listening on http://localhost:${PORT} ===\n`);
});