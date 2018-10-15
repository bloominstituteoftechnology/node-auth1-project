const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const server = express();
port = 7000;

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send('Sane')
})
server.listen(port, () => console.log(`\n API running on port ${port}`))
