const express = require('express');
const router = express.Router();
const User = require('./UserModel');



router.get('/api/users', (req, res) => {
 User.find()
 .then(user => {
     res.status(201).json(user)
 })
 .catch(err => {
     res.status(500).json({error: err})
 })
})

router.post('/api/register',(req, res) => {
    const { username, password } = req.body;
    const newUser = new User({username, password});
    User.create(newUser)
    .then(user => {
        res.status(201).json(user)
    })
    .catch(err => {
        res.status(500).json({error: err})
    })
   })

   module.exports = router;