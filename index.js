const express = require('express');
const server = express();

const knex = require('knex');
const dbConfig = require('./knexfile');

const bcrypt = require('bcryptjs');

const db = knex(dbConfig.development)
const PORT = process.env.PORT || 8999;

server.use(express.json());

//POST	/api/register

//POST	/api/login

//GET	/api/users

server.listen(PORT, () =>{
    console.log(`Server is listening on ${PORT}`)
})