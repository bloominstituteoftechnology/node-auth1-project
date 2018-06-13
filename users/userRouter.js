const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)
const User = require('./User.js');
const router = express.Router();

function authenticate (req, res, next) {
    if (req.session && req.session.username) {
        next()
    } else {
        res.status(401).send('You shall not pass')
    }
} // if there is a session, go to next middleware
// If there is not a session, do not allow continuation

router.use(authenticate)

router.route('/').get((req, res) => {
    
})

router.route('/users').get((req, res) => {
    User.find().then(users => res.send(users))
}) // if the user is logged in, they can access the list of users

router.route('/logout').get((req, res) => {
    if (req.session) {
        let name = req.session.username
        req.session.destroy(function(err) {
            if (err) {
                res.send(err);
            } else {
                res.send(`Goodbye, ${name}, ye shall be missed`)
            }
        })
    }
}) // if user is logged in, they can log out. If there is a session, destroy it - pull name from req.session.username and use it

module.exports = router;