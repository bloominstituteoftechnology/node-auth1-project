const router = require('express').Router();
const mongoose = require('mongoose');

const User = require('./userModel');


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
        password: req.body.password
    });

});
















module.exports = router;