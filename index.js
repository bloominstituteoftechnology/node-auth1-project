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
        res.status(201).json({ message: `User created with the id of ${id}` });
      })
      .catch(err => {
        res.json(err);
      });
  } else {
    res.status(400).json({ message: 'Please enter a username and password' });
  }
});

server.post('/api/login', (req, res) => {
  const user = req.body;
  db.findByUsername(user.username)
    .then(dbUser => {
      if (dbUser[0] && bcrypt.compareSync(user.password, dbUser[0].password)) {
        res.json({ message: 'You have successfully logged in' });
      } else {
        res.status(404).json({ message: 'Invalid username or password' });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

const PORT = 4040;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
