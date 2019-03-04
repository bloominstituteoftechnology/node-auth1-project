const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs')

const db = require('./helpers/model.js');

const server = express();

server.use(express.json());
server.use(cors());
server.use(helmet());


server.listen(5000, () => console.log('\nrunning on port 5000\n'));