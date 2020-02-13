const router = require('express').Router();

const Users = require('./user-model');
const authMiddle = require('../middleware/auth-req-middleware');


router.get('/', authMiddle, (req, res) => {
    Users.find()
    .then(user => {
        res.send(user)
    }).catch(err => {
        res.send(err)
    })
})







module.exports = router;