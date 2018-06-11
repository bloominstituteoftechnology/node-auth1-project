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
                res.status(500).error({ errorMessage: "You Shall Not PASS!", error: error.message })
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
router
    .route('/login')
    .post((req, res) => {
        const { username, password } = req.body;
        User
            .findOne({ username })
            .then(user => {
                if(user) {
                    user
                        .isPasswordValid(password)
                        .then(isValid => {
                            if(isValid) {
                                res.send("Login Successful")
                            } else {
                                res.status(401).send("Invalid Credentials")
                            }
                    })
                } else {
                    res.status(401).send("Invalid Credentials")
                }
            })
            .catch(error => {
                res.status(500).error({error: error.message})
            })
    })
module.exports = router;
