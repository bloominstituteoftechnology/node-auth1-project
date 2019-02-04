const express = require('express')
const router = express.Router()

const db = require('../helpers/db')

//endpoints
router.get('/', (req, res) => {
  db.getUsers()
    .then(users => {
      res
        .status(200)
        .json(users)
    })
    .catch(err => {
      res
        .status(500)
        .json({message: 'Failed to get users'})
    })
})

module.exports = router;