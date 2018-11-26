const express = require('express');
const bcrypt = require('bcryptjs');

const server = express();

server.get('/', (req, res) => {
  res.send('Helllo there.');
});

server.listen(3300, () => console.log('Server started on port 3300'));
