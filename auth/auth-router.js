const router = require('express').Router()
const bcrypt = require('bcryptjs')
const Users = require('../users/users-model.js')


router.post('/register', (req, res) => {
    let user = req.body;  
    
    const hash = bcrypt.hashSync(user.password, 8); // it's 2 ^ 8, not 8 rounds
    user.password = hash
    Users.add(user)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

  router.post('/login', (req, res) => {
    let { username, password} = req.body;
  
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.user = user  
          res.status(200).json({ message: `Welcome ${user.username}!` });
        } else {
          res.status(401).json({ message: 'You cannot pass!' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

  router.get('/logout', (req, res) => {
    if(req.session) {
      req.session.destroy(error => {
        if(error) {
          res.status(500).json({message: 'checkout'})
        } else {
        res.status(200).json({message: 'bye'})
        }
      })
    } else {
      res.status(200).json({message: 'already logged out'})
    }
  })

  module.exports = router