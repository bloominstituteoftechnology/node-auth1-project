// Base requirements
const express = require('express');
const knex = require('knex');
const bcrypt = require('bcryptjs');

// Server requirements
const server = express();
const dbConfig = require('./knexfile');
const db = knex(dbConfig.development);
const PORT = 5454;


/* ---------- Endpoints ---------- */

// -----
// POST:
// - /api/register 	
// - Creates a user using the information sent inside the body of the request. 
// - Hash the password before saving the user to the database.


// -----
// POST:
// - /api/login
// - Use the credentials sent inside the body to authenticate the user. On 
// - successful login, create a new session for the user and send back a 'Logged 
// - in' message and a cookie that contains the user id. If login fails, respond 
// - with the correct status code and the message: 'You shall not pass!'


// -----
// GET:
// - /api/users
// - If the user is logged in, respond with an array of all the users contained in 
// - the database. If the user is not logged in repond with the correct status 
// - code and the message: 'You shall not pass!'.



/* ---------- Listener ---------- */
server.listen( PORT, () => {
  console.log(`\n=== Web API listening on http://localhost:${PORT} ===\n`);
});