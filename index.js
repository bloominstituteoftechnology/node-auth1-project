const express = require('express');
const cors = require('cors');

const db = require('./database/dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());
server.use(helmet());

function logger(req, res, next){
    console.log(`${req.method} to ${req.url}`);

    next();
}

server.use(logger);

server.get('/', (req, res) => {
    res.send('It works yo');
})

const port = 9000;

server.listen(port, function() {
    console.log(`\n === WEB API LISTENING ON ${port} === \n`)
})