const router = require('express').Router();
const bcrypt = require('bcrypt');
const userModel = require('./userModel');

router
  .route('/register')
  .post((req, res) => {
    const { username, password } = req.body;
    userModel.create({ username, password })
      .then(user => res.json(user))
      .catch(error => res.status(500).json(error))
  });

router
  .route('/login')
  .post((req, res) => {
    const { username, password } = req.body;
    

    userModel.findOne({ username })
      .then(user => {
        console.log("user:",user);
        bcrypt.compare(password, user.password, (err, isValid) => {
          if (err) {
            throw err;
          }

          if (isValid) {
            console.log(isValid);
            console.log("The password is valid");
            req.session.id = user._id;
            console.log(`'/api/login' request.session:`,req.session);
            res.status(201).json({ "Success": "Logged in" });
          } else {
            res.status(403).json({ "Hey Bruh": "Go fuck yourself" });
          }
        });
      })
      .catch(error => res.json(error));
      //     .then(isValid => {
      //       console.log("'api/login' isValid:",isValid);
      //       console.log("The password 'plaintext' is valid.")
      //       res.status(201);
      //     })
      //     .catch(error => res.status(500).json(error));
      // });
  });

  router
    .route('/users')
    .get((req, res) => {
      if (!req.session.id) {
        res.status(403).json({error: "You must be logged in." });
        return;
      }
      userModel.find()
        .then(users => res.status(200).json(users))
        .catch(error => res.json(error));
    });

  module.exports = router;