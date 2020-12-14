const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../users/users-model')
const router = express.Router()

const checkPayload = (req, res, next) => {
  // needs req.body to include username, password
  if (!req.body.username || !req.body.password) {
    res.status(401).json('bad payload')
  } else {
    next()
  }
}
const checkUsernameUnique = async (req, res, next) => {
  // username must not be in the db already
  try {
    const rows = await User.findBy({ username: req.body.username })
    if (!rows.length) {
      next()
    } else {
      res.status(401).json('username taken')
    }
  } catch (err) {
    res.status(500).json('something failed tragically')
  }
}
const checkUsernameExists = async (req, res, next) => {
  // username must be in the db already
  // we should also tack the user in db to the req object for convenience
  try {
    const rows = await User.findBy({ username: req.body.username })
    if (rows.length) {
      req.userData = rows[0]
      next()
    } else {
      res.status(401).json('who is that exactly?')
    }
  } catch (err) {
    res.status(500).json('something failed tragically')
  }
}

router.post('/register', checkPayload, checkUsernameUnique, async (req, res) => {
  console.log('registering')
  try {
    // needs req.body to include username, password
    // username must not be in the db already
    // need to hash the password (can't save password raw in the db)
    const hash = bcrypt.hashSync(req.body.password, 10) // 2 ^ 10
    // create a new record in the db
    const newUser = await User.add({ username: req.body.username, password: hash })
    // send back appropriate code and response body
    res.status(201).json(newUser)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})
router.post('/login', checkPayload, checkUsernameExists, (req, res) => {
  try {
    console.log('logging in')
    // check req.body.password (raw password) against the hash saved inside req.userData.password
    const verifies = bcrypt.compareSync(req.body.password, req.userData.password)
    if (verifies) {
      console.log('we should save a session for this user')
      // HERE IS THE MAGIC!!!!!!!!
      // A SET-COOKIE HEADER IS SET ON THE RESPONSE
      // AN ACTIVE SESSION FOR THIS USER IS SAVED
      req.session.user = req.userData
      res.json(`Welcome back, ${req.userData.username}`)
    } else {
      res.status(401).json('bad credentials')
    }
  } catch (e) {
    res.status(500).json('something failed tragically')
  }
})
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.json('you can not leave')
      }
      else {
        res.json('goodbye')
      }
    })
  } else {
    res.json('there was no session')
  }
})

module.exports = router
