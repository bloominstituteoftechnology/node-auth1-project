const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./dbHelpers');

const server = express();

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send('Live server!');
});

server.post('/api/register', (req, res) => {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 14);
  if (user.username && user.password) {
    db.insertUser(user)
      .then(id => {
        res.status(201).json({ message: 'User created' });
      })
      .catch(err => {
        res.json(err);
      });
  } else {
    res.status(400).json({ message: 'Please enter a username and password' });
  }
});

const PORT = 4040;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
