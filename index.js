const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
//const db = require('./database/dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());

PORT = 7700;



server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
