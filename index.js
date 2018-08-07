const express = require('express');
const db = require('./data/db');
const server = express();
const session = require('express-session');
const bcrypt = require("bcrypt");

server.use(express.json());

server.post('/api/register', (req, res) => {
  const user = req.body;
  //const { username, password } = req;
  const hash = bcrypt.hashSync(user.password, 11);
  user.password = hash;
  //password = hash;
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

server.post('/api/login', (req, res) => {
  const credentials = req.body;
  //const { username, password } = req;
  db('users')
  .where({ username: credentials.username })
  .first()
  .then(user => {
    if (user && bcrypt.compareSync(credentials.password, user.password)) {
      return res.status(200).json({'message': 'You are now logged in.'})
    }
    return res.status(401).json({'errorMessage': 'The username and password you entered did not match our records. You shall not pass!'})
  })
  .catch(err => {
    res.status(500).json({'error': 'Could not login user'})
  })
});

server.get('/api/users', (req, res) => {

})

const port = 8080;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
