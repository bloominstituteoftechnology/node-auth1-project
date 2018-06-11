const router = require('express').Router()
const User = require('./userSchema')

router.route('/').post((req, res) => {
  // const input = ({ username, password } = req.body)
  User.create(req.body)
    .then(saveduser => res.status(201).json(saveduser))
    .catch(err => res.status(500).json({ error: err.message }))
})
module.exports = router
