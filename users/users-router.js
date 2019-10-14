const express = require('express')
// const bcrpty = require('bcrypt.js')
const Users = require('./users-model')
const router = express.Router();

router.get('/', (req, res) => {
    res.send("It works")
})


module.exports = router;