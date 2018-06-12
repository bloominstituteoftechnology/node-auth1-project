const express = require('express');
const router = express.Router();
const User = require('./UserModel');
const session = require('express-session');
const bcrypt = require('bcrypt');


const sessionOptions = {
    secret: 'nobody tosses a dwarf!',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 1, 
    },
    httpOnly: true,
    secure: false,
    resave: true,
    saveUninitialized: false,
    name: 'noname',
  };

  router.use(session(sessionOptions));

  function protected(req, res, next) {
    if (req.session && req.session.username) {
      next();
    } else {
      res.status(401).json({ message: 'you shall not pass!!' });
    }
  }

router.get('/api/users', protected, (req, res) => {
 User.find()
 .then(user => {
     res.status(200).json(user)
 })
 .catch(err => {
     res.status(500).json({error: err})
 })
})

router.get('/', (req, res) => {
    if (req.session && req.session.username) {
      res.status(200).json({ message: `welcome back ${req.session.username}` });
    } else {
      res.status(401).json({ message: 'speak friend and enter' });
    }
  });

router.post('/api/register',(req, res) => {
    const { username, password } = req.body;
    const newUser = new User({username, password});
    User.create(newUser)
    .then(user => {
        res.status(201).json(user)
    })
    .catch(err => {
        res.status(500).json({error: err})
    })
   })   
   router.post('/api/login', (req, res) => {
      const {username, password } = req.body
      User.findOne({ username})
        .then(user => {
            if(user) {  
                user.validatePassword(password)   //helper function used-Defined in userModel.js          
                // bcrypt.compare(password, user.password) without helper function
                .then(match => {                    
                    if(match) {
                    req.session.username = user.username;
                       res.send('have a cookie');
                    res.status(201).json('success');
                    }
                    else {
                    res.status(401).json('invalid credentials');
                    }      
                })
                .catch(err => {
                    res.status(500).json('error comparing password');
                })
            }
            else {
                res.status(401).json('invalid credentials');
            }          
          })    
        .catch(err => res.status(500).json({ message: `You shall not pass! error: ${err}` }))
    });

    router.get('/api/logout', (req, res) => {
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