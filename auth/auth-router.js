const bcrypt = require('bcryptjs'); // npm i bcryptjs

const router = require('express').Router();

const Users = require('../users/users-model');

router.post('/register', (req, res) => {
  let userInformation = req.body;

  bcrypt.hash(userInformation.password, 10, (err, hashedPasswod) => {
    userInformation.password = hashedPasswod;

    Users.add(userInformation)
      .then(saved => {
        req.session.username = saved.username;
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.username = user.username; // << good: add properties to existing session object
        // req.session = { username: user.username } // bad panda: don't override the session object
        res.status(200).json({
          message: `Welcome ${user.username}!`
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});


router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(error => {
      if (error) {
        res
          .status(500)
          .json({
            message:
              "you can check out any time you like, but you can never leave..."
          });
      } else {
        res.status(200).json({ message: "logged out successfully" });
      }
    });
  } else {
    res.status(200).json({ message: "bye felicia" });
  }
});

module.exports = router;
