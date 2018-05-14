const router = require('express').Router();

const User = require('./users.js');

router.post('/', (req, res) => {
    const user = new User(req.body);

    user
    .save()
    .then(user => {
        res.status(201).json(user)
    })
    .catch(err => {
        res.status(500).json({ error: 'Error Registering User!' })
    })
})






module.exports = router;