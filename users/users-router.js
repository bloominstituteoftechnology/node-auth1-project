const express = require('express');

const bcrypt = require('bcryptjs');



const Users = require('./users-model.js');



const router = express.Router();



router.get('/', (req, res) => {

    res.send('API working!');

});



router.get('/users', restricted, (req, res) => {

    //console.log(req.session);

        Users.find()

        .then(users => {

            res.status(200).json(users)

        })

        .catch(error => res.send(error));       

});



router.post('/register', (req, res) => {

    let user = req.body;

    const hash = bcrypt.hashSync(user.password, 10);

    user.password = hash;

    Users.add(user)

        .then(saved => {

            res.status(201).json(saved);

        })

        .catch(error => {

            res.status(500).json(error);

        });    

});



router.post('/login', (req, res) => {

    let {username, password} = req.body;

    Users.findBy({ username })

        .first()

        .then(user => {

            if (user && bcrypt.compareSync(password, user.password)) {

                req.session.user = user;

                console.log('login:', req.session);

                res.status(200).json({ message: `Welcome ${user.username}!` });

              } else {

                res.status(401).json({ message: 'You shall not pass!' });

              }

        })

        .catch(error => {

            res.status(500).json(error);

        });

});



router.get('/logout', (req, res) => {

    if(req.session) {

        console.log('logout:', req.session);

        req.session.destroy(error => {

            if (error) {

                res.status(500).json({ message: 'Unable to log user out.' })

            } else {

                console.log('logged out:', req.session);

                res.status(200).json({ message: 'User successfully logged out.' });

            }

        });

    } else {

        res.status(200).json({ message: 'User already logged out.' });

    }

});



//custom middleware

function restricted (req, res, next) {

    console.log('request:', req.session);

    if (req.session && req.session.user) {

      next();

    } else {

      res.status(401).json({ message: 'You shall not pass!' })

    }

  };



module.exports = router;