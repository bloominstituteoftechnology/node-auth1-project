const express = require('express')
const router = express.Router()
const middleWare = require('../middleware/middleware')

const db = require('../helpers/db')

router.use(middleWare.useSession)

const protected = (req, res, next) => {
  (req.session && req.session.user) ? next(): res.status(401).json({message: 'not logged in, You shall not pass'})
}

//endpoints
router.get('/', protected, (req, res) => {
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