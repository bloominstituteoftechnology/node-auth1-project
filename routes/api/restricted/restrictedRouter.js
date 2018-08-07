const router = require('express').Router()

//* Local Middleware
const validateUser = (req, res, next) => {
  if (!req.session.username) {
    return res.status(401).json('user must login to access resource')
  }
  next()
}

router.get('/', validateUser, (req, res, next) => {
  res.status(200).json({ msg: 'let us party 🎉 ' })
})

module.exports = router
