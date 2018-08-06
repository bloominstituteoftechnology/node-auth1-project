const express = require('express');
const db = require('./data/db');
const server = express();

const bcrypt = require("bcrypt");

server.use(express.json());

server.post('/api/register', (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 11);
  user.password = hash;
  if (!user) {
    res.status(400).json({ errorMessage: "Please provide a username and password." })
    return;
}
  db('users')
  .insert(user)
  .then(id => {
    return res.status(200).json({'message': 'User registered'})
  })
  .catch(err => {
    res.status(500).json({'error': 'Could not register user'})
  })
});

const port = 8080;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
