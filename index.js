const express = require('express');
const knex = require('knex');
const knexConfig = require('./knexfile')

const db = knex(knexConfig.development);
const server = express();
server.use(express.json());



const port = process.env.PORT || 5000;
server.listen(port, ()=> console.log(`\n Running on ${port}\n`))
