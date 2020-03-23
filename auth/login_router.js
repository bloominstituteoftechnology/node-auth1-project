const bcrypt = require('bcryptjs');
const express = require('express');

const User = require('../users/users_model');

const router = express.Router();

router.post('/', (req, res) => {
  const {username, password} = req.body;

  User.findBy({username})
    .first()
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        //makes it remember the client
        req.session.user = {
          id: user.id,
          username: user.username
        };
        res.status(200).json({hello: user.username});
      } else {
        res.status(401).json({message: 'invalid login'});
      }
    })
    .catch(err => {
      res.status(500).json({message: 'Invalid user', error: err.message});
    });
});

module.exports = router;
