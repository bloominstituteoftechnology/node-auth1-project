const router = require('express').Router();

const User = require('./userModel');

router.get('/', (req,res) => {
    User.find()
        .then(user => {
            res.json(user);
        })
        .catch(error => res.send(error));
});

module.exports = router;