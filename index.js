const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('./database/dbHelpers.js');

const server = express();

server.use(express.json());
server.use(cors());

server.post('/api/register', (req, res) => {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 15);
  db.insert(user)
    .then(ids => {
      res.status(201).json({ id: ids[0] });
    })
    .catch(err => {
      res.status(500).send(err);
    })
})

server.post('/api/login', (req, res) => {
  const user = req.body;
  db.findByUsername(user.username)
    .then(users => {
      if (users.length && bcrypt.compareSync(user.password, users[0].password)) {
        res.json({ message: "Logged in" })
      } else {
        res.status(404).json({ err: "Invalid username or password" });
      }
    })
    .catch(err => {
      res.status(500).send(err)
    })
})

server.get('/api/users', (req, res) => {

})

const PORT = 3300;
server.listen(3300, () => {
  console.log(`\nServer is running on PORT ${PORT}\n`);
})