const express = require('express'); 
const knex = require('knex'); 
const dbConfig = require('./knexfile'); 
const db = knex(dbConfig.development); 

const server = express(); 
server.use(express.json()); 

server.listen(3400, () => {
    console.log("This server is listening on port 3400")
})