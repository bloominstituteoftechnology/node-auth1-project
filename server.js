const express = require('express');

const db = require('./data/dbHelp');

const bcrypt = require('bcrypt');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send('<h1> Its Nice, I like, How Much <h1>')
})

server.get('/api/users', (req, res) => {
    db.find()
      .then(user => {
        res.status(200).json(user);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

  server.post('/api/register', (req, res) => {
      users = req.body;
      const hash = bcrypt.hashSync(users.password, 10);
      users.password = hash;

      db.add(users)
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(500).json(err);
        });
  });

  server.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.login({ username: username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          res.status(200).json({ message: `Welcome ${user.username}` });
        } else {
          res.status(404).json({ message: "Invaild Login" });
        }
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

module.exports = server;