const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const server = express();

server.use(express.json())
server.use(cors())

const PORT = 4400;



server.listen(4400, () => console.log(`Listening on port ${PORT}`));