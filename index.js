const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./database/dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());

const port = 8000;

server.listen(port, ()=> console.log(`API running on port ${port}`));