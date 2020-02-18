const router = require('express').Router();

const Users = require('./user-model');
const protected = require('../middleware/auth-req-middleware');


router.get('/', protected, (req, res) => {
    Users.find()
    .then(user => {
        res.json(user)
    }).catch(err => {
        res.send(err)
    })
})







module.exports = router;