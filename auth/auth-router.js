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
      //? s61
      req.session.username = saved.username;
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
        //? s60
        req.session.user = user;
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


//? s65 logout
router.get('/logout', (req, res) => {
  if(req.session) {
    req.session.destroy(err => {
      if(err) {
        
        res.status(500).json({message: 'you can checkout any time you like, but you can never leave'})
      } else {
        // res.status(204).end(); //or
        res.status(200).json({message: 'bye, thanks for playing.'});
      }
    })
  } else {
    res.status(200).json({message: 'You were never here to begin with.'})
  }
})

//? s22
module.exports = router