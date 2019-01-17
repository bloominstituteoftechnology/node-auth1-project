const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./database/dbHelpers.js')
const server = express();

server.use(express.json());
server.use(cors());


server.listen(3300, () => console.log('\nrunning on port 3300\n'));