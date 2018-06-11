const router = require('express').Router();
const User = require('./UserModel');

router
    .route('/users')
    .get((req, res) => {
        User
            .find()
            .then(users => {
                res.status(200).json(users)
            })
            .catch(error => {
                res.status(500).error({ error: error.message })
            })
    })
router
    .route('/register')
    .post((req, res) => {
        User
            .create(req.body)
            .then(user => {
                res.status(201).json({ success: "New User Added to Database", user })
            })
            .catch(error => {
                res.status(500).error({ error: error.message })
            })
    })

module.exports = router;
