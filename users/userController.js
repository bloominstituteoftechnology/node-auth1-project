const router = require('express').Router();
const mongoose = require('mongoose');

const session = require('express-session');

const User = require('./userModel');

//looking to see how this middleware works
const sessionOptions = {
    secret: 'To be, or not To be - Khan',
    cookie: {
        maxAge: 1000 * 60 * 60, // an hour
    },
    httpOnly: true,
    secure: false,
    resave: true,
    saveUninitialized: false,
    name: 'noname',
};



router.route('/api/users').get((req, res) => {
    User.find()
    then(users => {
        res.status(200).json(users);
    })
        .catch(error => {
            res.status(500).json({ error: 'You shall not Pass' });
        })
});  

router.route('/api/register').post((req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
    });
    
    User.create(user, (err) => { 
        if (err) {
            return res.status(500).json(user);
        } else {
            res.status(201).json(err);
        }    
    })
        
});

router.route('/api/login').post((req, res) => {
    const user = ({ username, password } = req.body);

    User.findOne(user, (err) => {
        if (err) {
            return res.status(500).json({ error: 'You shall not Pass' });
        } else {
            res.status(201).json(err);
        }    
    });
});


router.route('/api/logout').get((req, res) => {
    if (req.session) {
        req.session.delete(err => {
            if (err) {
                res.send('error logging out');
            } else {
                res.send('good day to you, Sir!!');
            }
        });
    }
});



module.exports = router;