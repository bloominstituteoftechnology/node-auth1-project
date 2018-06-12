// const router = require('express').Router(); //declares that all routes for this address will be found on this router.
const express = require('express');
const router = express.Router();
const User = require('./UserModel');

// https://www.cheatography.com/kstep/cheat-sheets/http-status-codes/ 

const session = require('express-session');

//middleware
const sessionOptions = {
    secret: 'nobody tosses a dwarf!',
    cookie: {
        maxAge: 1000 * 60 * 60, // set to expire in an hour (written in milli-seconds)
    },
    httpOnly: true, // only send on http requests
    secure: false, //only send on https - the secure version of http
    resave: true,
    savedUnititalized: false,
    name: 'noname',
}

router.use(session(sessionOptions));

//custom middleware
function protected (req, res, next) {
    if(req.session && req.session.username) {
        next();
    } else {
        res.status(401).json({message: 'you shall not pass'})
    }
}

router
    .route('/api/users')
    .get(protected, (req, res) => {
     
        User.find()
            .then(users => {
                res.json(users);
            })
            .catch(err => {
               res.json(err);
            })
});

router
    .route('/')
    .get((req, res) => {
    if (req.session && req.session.username) {
      res.status(200).json({ message: `welcome back ${req.session.username}` });
    } else {
      res.status(401).json({ message: 'speak friend and enter' });
    }
  });



router
    .route('/api/register')
    .post((req, res) => {
    // traditional way of getting db info
    // const { username, password } = req.body;

    // save the user to the database
    User.create(req.body)
        .then(user => { 
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json({err: 'Unable to save user.'});
        });
});

router
    .route('/api/login')
    .post((req, res) => {
         //grab the credentials
        const { username, password } = req.body;
        //find the user to get access to the stored password
        User.findOne({ username })
        .then(user => { 
            // if user not found we get null 
            if (user) {
                // compare password guess to the stored password
               user // using lowercase user from line 53
               .validatePassword(password) //compare password guess to the stored password
               .then(passwordsMatch => {
                   //if the passwords match, then we can continue
                  if (passwordsMatch) {
                      req.session.username = user.username;
                      res.send('have a cookie');
                  } else {
                      res.status(401).send('invalid credentials');
                  }
               })
               .catch(err => {
                   res.send('error comparing passwords');
               });
            } else {
                //if not found
                res.status(401).send('invalid credentials')
            }
        })
        .catch(err => {
            res.send(err);
        })
    })

    router
        .route('/api/logout')
        .get((req, res) => {
            if(req.session) {
                req.session.destroy(err => {
                    if (err) {
                        res.send('error logging out');
                    } else {
                        res.send(`good-bye`);
                    }
                })
            }
        })


module.exports = router;