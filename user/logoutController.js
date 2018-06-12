const router = require('express').Router()
// const User = require('./userSchema')

router.route('/').get((req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('error logging out')
      } else {
        res.send('see ya!')
      }
    })
  }
})
module.exports = router
