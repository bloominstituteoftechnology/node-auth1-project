const express = require("express");
const knex = require("knex");
const server = express(); 
const dbConfig = require('./knexfile');
const db = knex(dbConfig.development); 
const PORT = 4000;

server.use(express.json());



server.listen(PORT, () => {
    console.log("server is running in port " + PORT)
})