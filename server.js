const express = require('express');
const helmet = require('helmet');

const bcrypt = require('bcryptjs');

const db = require('./data/dbConfig.js');
const Users = require('./users/users-model.js');

const server = express();

server.use(helmet());
server.use(express.json());


server.get('/', (req, res) => {
    res.send("We did the mash ---- we did the Monster Mash!");
});


server.post('/api/register', (req, res) => {
    let user = req.body;

    const hash = bcrypt.hashSync(user.password, 12);

    user.password = hash;

    Users.add(user)
      .then(saved => {
          res.status(201).json(saved);
      })
      .catch(error => {
          res.status(500).json(error);
      });
});

server.post('/api/login', (req, res) => {
    let {username, password} = req.body;

    Users.findBy({username})
      .first()
      .then(user => {
          if (user && bcrypt.compareSync(password, user.password)) {
              //use cookies on Tuesday to create a new session upon login
              res.status(200).json({message: `Welcome ${user.username}!`});
          } else {
              res.status(401).json({message: 'You shall not pass!'});
          }
      })
      .catch(error => {
          res.status(500).json(error);
      });
});

function restricted(req, res, next) {
    const {username, password} = req.headers;

    if (username && password) {
        Users.findBy({username})
          .first()
          .then(user => {
              if (user && bcrypt.compareSync(password, user.password)) {
                  next();
              } else {
                  res.status(401).json({message: 'You shall not pass!'});
              }
          })
          .catch(error => {
              res.status(500).json({message: 'An error has occurred.'});
          });
    } else {
        res.status(400).json({message: 'PLease provide a username and password.'});
    }
}

server.get('/api/users', restricted, (req, res) => {
    Users.find()
      .then(users => {
          res.json(users);
      })
      .catch(error => res.send(error));
});

module.exports = server;