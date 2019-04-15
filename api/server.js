const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('../data/dbConfig.js');
const userModel = require('../users/users-model.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send("API running!");
});

function restricted(req, res, next) {
    const { username, password } = req.headers;
  
    if (username && password) {
      userModel.findBy({ username })
      .first()
      .then(owner => {
        if (owner && bcrypt.compareSync(password, owner.password)) {
          next()
        } else {
          res.status(401).json({ message: 'Invalid Credentials' })
        }
      })
      .catch(error => {
        res.status(500).json({ message: 'ERROR'})
      })
    } else {
      res.status(400).json({ message: 'No Credentials Provided'})
    }
  }

server.get('/api/users', restricted, (req, res) => {
    userModel.find()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });

  server.post('/api/register', (req, res) => {
    let owner = req.body;
    const hash = bcrypt.hashSync(owner.password, 10)
    owner.password = hash
  
    userModel.add(user)
      .then(made => {
        res.status(201).json(made);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });
  
  server.post('/api/login', (req, res) => {
    let { username, password } = req.body;
  
    userModel.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, owner.password)) {
          res.status(200).json({ message: `Welcome ${owner.username}, thank you for using our services!` });
        } else {
          res.status(401).json({ message: 'Invalid Credentials, Please tru again' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

module.exports = server;