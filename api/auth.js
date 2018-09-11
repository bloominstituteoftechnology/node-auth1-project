const express = require('express');
const db = require('../data/dbConfig');
const bcrypt = require('bcryptjs');

const router = express.Router();

//create a user and save to db, hashing password
router.post('/register', (req, res) => {
  let { username, password }  = req.body;

  if(!username || !password) return res
                                      .status(422)
                                      .json({
                                        message: 'A username and password is required for this operation!'
                                      });
  const hash = bcrypt.hashSync(password, 16);
  password = hash;
  db('users')
    .insert({ username, password })
    .then(ids => {
      const id = ids[0];
      res.status(201).json(id);
    })
    .catch(err => res.status(500).json(err));
});

//authenticate passed in user data, message 'You shall not pass!' on failure
//tuesday: create a new session and send back cookie
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if(!username || !password) return res
                                      .status(422)
                                      .json({
                                        message: 'A username and password is required for this operation!'
                                      });
  db('users')
    .where({ username })
    .first()
    .then(user => {
      if(user && bcrypt.compareSync(password, user.password)){
        req.session.name = user.username;
        res.status(200).json({ message: 'Logged In' });
      }else if(!user){
        res.status(404).json({ message: 'Invalid Username' });
      }else{
        res.status(401).json({ message: 'You shall not pass!' });
      }
    })
    .catch(err => res.status(500).json(err));
});

//logout current user
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if(err) {
        res.send('error logging out');
      }else{
        res.status(200).json({ message: 'logged out' });
      }
    });
  }
});

module.exports = router;
