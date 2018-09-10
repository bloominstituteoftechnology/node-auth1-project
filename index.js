const knex = require('knex');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const db = require('./db/db.js')

const server = express();

server.use(express.json());
server.use(cors());
server.use(helmet());

server.get('/', (req,res) => {
    res.status(200).json({message: "server is running"})
})

server.listen(4500, () => {console.log('\n === server running on 4500 === \n')})