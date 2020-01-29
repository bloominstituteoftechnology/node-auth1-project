const router = require('express').Router();
const user = require('./authnModel');
const restrict = require('../authN /middleware/restrict')


router.get('/', restrict,(req, res) =>{
    user.find()
        .then(users =>{
            res.json(users);
        })
    .catch(err =>{
        console.log(err);

        res.status(500) .json ({ message: 'error fetching users'});
    })
})

module.exports = router;