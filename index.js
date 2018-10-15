const express = require('express');
const cors = require('cors');

const bcrypt = require('bcryptjs');

const db = require('./database/dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
    res.send("It's allliiiiive!!!");
});

const port = 8888;
server.listen(port, () => console.log(`API running on ${port}`));