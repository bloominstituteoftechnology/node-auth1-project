const express = require('express');
const bcrypt = require('bcryptjs'); // adds hash library

const db = require('./database/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.send('Server running');
});

const port = 8765;
server.listen(port, () => console.log(`\nServer listening on port ${port}\n`));