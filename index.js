const express = require('express');
const bcrypt = require('bcryptjs');

const port = process.env.PORT || 9000;
const server = express();

server.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to auth I' });
});

server.listen(port, () => {
  console.log(`\n === Server listening on ${port}k === \n`);
});
