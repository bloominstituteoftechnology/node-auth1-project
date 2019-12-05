//? s21
const router = require('express').Router();


//? s31 import 
const bcrypt =require('bcryptjs');

//? s32
const Users = require('../users/users-model.js');

//? s33
router.post('/register', (req, res) => {
  let user = req.body;
  //? s33a
  const hash = bcrypt.hashSync(user.password, 10);
  //? s33b
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

//? s34
// /api/auth/login validation part
router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
        //? s34a
      // if(user){
        // password from body and user.password from database.
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

//? s35 create auth-required-middleware.js file

//? s22
module.exports = router