const express = require('express');
const server = express();
const helmet = require('helmet');
const cors = require('cors');

server.use(cors());
server.use(helmet());
server.use(express.json());

server.get('/', (req,res) => {
    res.send('<p>Hello from the API</p>')
})
server.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({
        message: "Something went wrong."
    })
})

module.exports = server;