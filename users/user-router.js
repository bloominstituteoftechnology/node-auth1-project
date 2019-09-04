const express = require('express');
const bcrypt = require('bcryptjs');

const Users = require('./users-model.js');

const router = express.Router();

router.get('/users', Users.restricted, (req, res) => {
    Users.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
});

router.post('/register', (req, res) => {
    let user = req.body;
    console.log('password arriving from client', user.password);
  
    //salt 
    user.password = bcrypt.hashSync(user.password, 14);
    console.log('password heading to db', user.password);
  
    Users.add(user)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json(error);
      });
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;
  
  
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          console.log('db password', user.password);
          console.log('login password', password);
          res.status(200).json({ message: `Welcome ${user.username}!` });
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
});

module.exports = router;