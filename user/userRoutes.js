const router = require('express').Router();
const bcrypt = require('bcrypt');
const userModel = require('./userModel');

const fieldFilledCheck = ({ username, password }, res) => {
  if (!username || !password) {
    res.status(400).json({ error: "Both 'username' and 'password' fields required." });
    return false;
  }
  return true;
};

router
  .route('/register')
  .post((req, res) => {
    const { username, password } = req.body;
    if (!fieldFilledCheck(req.body, res)) return;
    //==>
    userModel.create({ username, password })
      .then(user => res.json(user))
      .catch(error => res.status(500).json(error))
  });

router
  .route('/login')
  .get((req, res) => {
    res.json({ "Login Route": "Please do a POST request with user credentials in the body of the request." });
  })
  .post((req, res) => {
    const { username, password } = req.body;
    if (!fieldFilledCheck(req.body, res)) return;
    //==>
    userModel.findOne({ username })
      .then(user => {
        console.log("user:",user);
        if (user) {
          console.log(user.validatePassword);
          user
            .validatePassword(password)
            .then(isValid => {
              console.log("isValid:",isValid);
              if (isValid) {
                req.session.username = user.username;
                res.status(200).json({ "Welcome": "Log-In Successful." });
              } else {
                res.status(401).json({ error: "Could not log you into the server." });
              }
            })
            .catch(error => res.json(error));
        } else {
          res.json(401).json({ error: "Could not log you into the server." });
        }

      })
      .catch(error => res.json(error));
  });

router
  .route('/logout')
  .get((req, res) => {
    req.session.destroy(err => {
      if (err) {
        res.status(500).json({ error: "Could not log you out of the server." });
        return;
      }
      res.status(200).json({ "Goodbye": "Log-Out Successful." });
    });
  });
  
router
  .route('/users')
  .get((req, res) => {
    userModel.find()
      .then(users => res.status(200).json(users))
      .catch(error => res.json(error));
  });

module.exports = router;