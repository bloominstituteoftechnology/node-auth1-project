const express = require('express');
const router = express.Router();
const User = require('./User');

router.post('/register', (req, res) => {
    const userInfo = req.body;
    const newUser = new User(userInfo);
    newUser.save()
      .then( user => {
          res.status(201).json(user);
      })
      .catch( err => res.status(500).json(err));
})

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    User.findOne({username})
      .then( user => {
          if (user === null) res.sendStatus(404);
          user.comparePasswords(password)
            .then( isMatch => {
                if (isMatch) {
                    req.session.loggedIn = true;
                    res.status(200).json({msg: 'Logged in.'});
                } else {
                    res.status(401).json({msg: 'YOU SHALL NOT PASS!'});
                }
            })
            .catch( err => res.sendStatus(500));
      })
      .catch( err => res.status(500).json(err));
})

module.exports = router;