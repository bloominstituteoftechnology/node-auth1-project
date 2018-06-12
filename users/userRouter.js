const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const User = require('./userModel.js');

const router = express.Router();

router
    .route('/restricted/users')
        .get((req, res) => {
            User.find()
                .then(users => res.json(users))
                .catch(err => res.json(err))
        })

router
    .route('/register')
        .post((req, res) => {
            User.create(req.body)
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
            const { username, password } = req.body;

            User.findOne({ username })
                .then(user => {
                    if (user) {
                        user.validatePassword(password)
                            .then(passwordsMatch => {
                                if (passwordsMatch) {
                                    req.session.username = user.username;
                                    res.send('have a cookie');
                                } else {
                                    res.status(401).send('Incorrect username or password');
                                }
                            })
                            .catch(err => {
                                res.send(err);
                            })
                    }
                })
        })

router
    .route('/logout')
        .get((req, res) => {
            if (req.session) {
                req.session.destroy(err => {
                    if (err) {
                        res.send('could not log out')
                    } else {
                        res.send('logout successful')
                    }
                })
            }
        })

module.exports = router;