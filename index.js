const express = require('express');
const helmet = require('helmet');

const db = require('./data/dbConfig.js');

const port = 5000;
const server = express();

server.use(express.json());
server.use(helmet());

server.get('/', (req, res) => {
    res.send('Am I Alive?'); //Yes
});

server.listen(port, () => console.log(`\n=== Listening on Port ${port} ===\n`));


