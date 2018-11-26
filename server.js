const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// initialize server
const server = express();

//Middleware
server.use(express.json());
server.use(cors());
server.use(helmet());

//Endpoints

//Sanity Check
server.get('/', (req, res) => {
    res.json({message: 'its alive'})
})


module.exports = server