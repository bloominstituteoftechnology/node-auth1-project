const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const server =  express();

server.use(express.json());
server.use(cors());

const port = 3333;
server.listen(port, () => console.log(`==listening on port ${port}==`));