const router = require('express').Router()
const User = require('./userSchema')

router.route('/').post((req, res) => {
  const { username, password } = req.body
  User.findOne({ username })
    .then(founduser => {
      if (founduser) {
        founduser
          .isPasswordValid(password)
          .then(passwordMatched => {
            if (passwordMatched) {
              req.session.username = founduser.username
              res.send('Login successful')
            } else {
              res.status(401).send('invalid credentials')
            }
          })
          .catch(err => {
            res.send({ error: err })
          })
      } else {
        res.status(401).send('invalid credentials')
      }
    })
    .catch(err => {
      res.send(err)
    })
})
module.exports = router
