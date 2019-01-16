const express = require('express');
const server = express();

const knex = require('knex');
const dbConfig = require('./knexfile');
const db = knex(dbConfig.development);

const PORT = process.env.PORT || 3500;

server.use(express.json());


//SERVER

server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
});


