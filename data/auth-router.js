const bcrypt = require('bcryptjs');
const Users = require('./users.js');
const router = require('express').Router();

router.post('/register', (req, res) => {
    let user = req.body;
  
  user.password= bcrypt.hashSync(user.password, 10); 
  
    Users.add(user)
      .then(saved => {
        req.session.user = saved;
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

  router.post('/api/login', (req, res) => {
    let { username, password } = req.body;
  
    password= bcrypt.hashSync(user.password, 10); 

    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          req.session.user = user;
          res.status(200).json({ message: `Logged in, ${user.username}` });
        } else {
          res.status(401).json({ message: 'You shall not pass!' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });


  module.exports = router;