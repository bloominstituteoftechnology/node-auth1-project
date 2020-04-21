const express = require('express')
const bcrypt = require('bcryptjs')
const Auth = require('./auth-model')

const router = express.Router()


router.post('/register', (req, res) => {
  const cred = req.body

  let rounds = process.env.ROUNDS || 8
  const hash = bcrypt.hashSync(cred.password, rounds)

  cred.password = hash

  Auth.addUser(cred)
    .then(user => {
      res.status(201).json(user)
    })
    .catch(err => {
      res.status(500).json({ error: err.message })
    })
})

router.post('/login', (req, res) => {
  let { username, password } = req.body
  
  Auth.getByUsername(username)
    .then((user) => {
      console.log(user)
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.loggedIn = true;
        res.status(200).json({ message: "You are logged in."})
      } else {
        res.status(401).json({ message: "You shall not pass!"})
      }
    })
})

router.get('/users', authMiddleware, (req, res) => {
  Auth.getUsers()
    .then(users => res.json(users))
})

function authMiddleware(req, res, next){
  if (req.session.loggedIn){
    next()
  } else {
    res.status(401).json({ message: "You shall not pass!"})
  }
} 



module.exports = router