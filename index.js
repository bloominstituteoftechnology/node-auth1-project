const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const server = express();

server.use(express.json());
server.use(helmet());

server.get('/', (req, res) => res.json('Server is up and running!'));

const port = 6000;
server.listen(port, () => console.log(`API is listening on port ${port}.`));
