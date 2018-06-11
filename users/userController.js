const router = require('express').Router();

const User = require('./userModel');


router.route('/api/users').get((req, response) => {
    User.find()
    then(users => {
        res.status(200).json(users);
    })
        .catch(error => {
            res.status(500).json({ err });
        })
});  














module.exports = router;