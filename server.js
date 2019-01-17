const ENV = 'development';
const express = require('express');
const knex = require('knex');
const dbCONFIG = require('./knexfile.js');

const server = express();
const db = knex(dbCONFIG[ENV])
server.use(express.json())

const PORT = 4444;


server.listen(PORT, (err) => {
    if (err) {console.log(err)}
    else {console.log(`listening on port ${PORT}`)}
})