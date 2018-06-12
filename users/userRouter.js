const express = require('express');
const mongoose = require('mongoose');

const User = require('./userModel.js');

const router = express.Router();

function protected(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: 'you shall not pass!!' });
  }
}

router
  .route('/register')
  .post((req, res) => {
    User
      .create(req.body)
      .then(user => {
        res.status(201).json(user);
      })
      .catch(err => {
        res.status(500).json(err);
      })
  })

router
  .route('/login')
  .post((req, res) => {
    const { username, password } = req.body
    User
      .findOne( { username })
      .then(user => {
        if(user) {
          user
            .validatePassword(password)
            .then(passwordMatch => {
              if(passwordMatch) {
                req.session.username = user.username;
                console.log(req.session.username);
                res.send('login successful');
              } else {
                res.status(401).send('invalid credentials');
              }
            })
            .catch(err => {
              res.send('error comparing passwords');
            });
        } else {
          res.status(401).send('invalid credentials')
        }
      })
      .catch(err => {              
        res.status(500).json(err);
      })
    })

router
  .route('/users')
  .get(protected, (req, res) => {
    User
      .find()
      .then(users => {
        res.status(201).json(users);
      })
      .catch(err => {
        res.status(500).json(err);
      })
  })

router
  .route('/logout')
  .get((req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.send('error logging out');
        } else {
          res.send('good bye');
        }
      });
    }
  });


module.exports = router;