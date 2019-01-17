const express = require('express');
const knex = require('knex');
const dbConfig = require('./knexfile');

const db = knex(dbConfig.development);

const server = express();
const bcrypt = require('bcryptjs');



server.use(express.json());

server.listen(5000, () =>{
    console.log('Server is up and running!');
})