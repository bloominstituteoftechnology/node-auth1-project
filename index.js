const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const server = express();

server.use(express.json());
server.use(cors());






server.listen(3333, () => console.log('\nrunning on port 3333\n'));