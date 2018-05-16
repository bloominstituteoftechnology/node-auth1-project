const router = require('express').Router();

const User = require('./users.js');

router.get('/', (req, res) => {
    User
    .find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        res.status(500).json({ error:'Could Not Get Users!' })
    })
})








module.exports = router;