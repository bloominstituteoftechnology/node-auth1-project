const router = require('express').Router();
const User = require('../models/user');

router
  .post('/', (req, res) => {
    const { username, password } = req.body;

    if(!username || !password){
      res.status(400).json({ error: 'Please include both a username and password' });
      return;
    }

    User.findOne({ username })
      .then(user => {
        if(user){
          user.isPasswordValid(password)
            .then(login => {
              if(login){
                req.session.userId = user._id;
                res.status(200).json({
                  message: 'Logged in',
                  userId: req.session.userId
                });
              } else {
                res.status(401).json({ error: 'You shall not pass!' });
              }
            });
        } else {
          res.status(401).json({ error: 'You shall not pass!' });
        }
      })
      .catch(error => {
        res.status(500).json({ error: error });
      });
  })

module.exports = router;