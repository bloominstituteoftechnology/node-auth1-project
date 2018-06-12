const router = require('express').Router()
const User = require('./userSchema')

function protectedRoute (req, res, next) {
  if (req.session && req.session.username) {
    next()
  } else {
    res.status(401).json({ message: 'you shall not pass!!' })
  }
}

router.route('/').get(protectedRoute, (req, res) => {
  User.find().then(users => res.json(users)).catch(err => res.json(err))
})

module.exports = router
