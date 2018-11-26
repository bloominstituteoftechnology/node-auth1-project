const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./database/dbconfig.js');

const server = express();
server.use(express.json());
server.use(cors());




server.get('/', (req, res) => {
    res.send("Server is RUNNING !");
})
server.listen(9000, () => console.log('Server is UP at 9000'));

