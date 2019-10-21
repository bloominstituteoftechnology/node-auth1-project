const express = require('express');
const router = express.Router();
const App = require('./users-model.js');
const bcrypt = require('bcryptjs');

const restricted = require('../users/restricted-middleware.js');






router.post('/register', (req, res) => {
    const user = req.body;
    const hash = bcrypt.hashSync(user.password, 8)
    user.password = hash;
    App.add(user)
        .then(newUser => {
            res.status(201).json(req.body)
        })
        .catch(err => {
            res.status(500).json(err);
        });
});



router.post('/login', (req, res) => {
    let { username, password } = req.body;
    console.log('session', req.session);
    App.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          req.session.username = user.username;
  
          console.log('session', req.session);
          res.status(200).json({
            message: `Welcome ${user.username}!`,
          });
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });



  router.get('/', (req, res) => {
    console.log('username', req.session.username)
    App.find()
      .then(users => {
        res.json(users);
        console.log(username)
      })
      .catch(err => res.send(err));
  });



router.get('/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            if(err) {
                res.json({ message: "could not log user out"})
            } else {
                res.status(200).json({ message: "logout was successful" })
            }
        })

    } else {

        res.status(200).json({ message: "App session ended successfully" })

    }

})

module.exports = router;