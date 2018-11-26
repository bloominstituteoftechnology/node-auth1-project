const express = require('express');
const server = express();
const knex = require('knex')
const knexConfig = require('./knexfile');

const db = knex(knexConfig.development);

const cors = require('cors');

server.use(cors());
server.use(express.json())

const port = process.env.PORT || 8888;
server.listen(port, ()=>console.log(`Server is listening on Port ${port}`))