const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const session = require('express-session')

const db = require('../helpers/db')

const sessionConfig = {
  name: 'cookie',
  secret: 'slkjdnvwireufnlse89r3qghpq39erhq[weif',
  cookie: {
    maxAge: 1000 * 60 * 5,
    secure: false, // should be true in production
  },
  httpOnly: true,
  resave: false,
  saveUninitialize: false,
} 


//endpoints
router.post('/register', (req, res) => {
  const creds = req.body //grab username/password
  const hash = bcrypt.hashSync(creds.user_name, 14) // hash password
  creds.password = hash
  
  db.register(creds)
    .then(id => {
      res
        .status(201)
        .json(id)
    })
    .catch(err => {
      res
        .status(500)
        .json({message: 'registration failed'})
    })
})

router.post('/login', (req, res) => {
  const creds = req.body
  db.login(creds.user_name)
    .then(user => {
      if(user && bcrypt.compareSync(creds.password, user.password)) {
        res
          .status(201)
          .json({message: 'Welcome'})
      } else {
        res
          .status(401)
          .json({message: 'You shall not pass!'})
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({message: 'Login Failed'})
    })
})



module.exports = router;