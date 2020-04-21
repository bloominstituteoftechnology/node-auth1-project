const express = require('express')
const authRoute = require('./auth')
const session = require('express-session')

const router = express.Router()


const sessionConfig = {
  name: 'CookieName',
  secret:  process.env.SESS_SECRET || 'session_secret',
  cookie:  {
    secure: process.env.SECURE || false, //specifies whether can send over http/unencrypted protocol
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false,
}


router.use(session(sessionConfig))
router.use('/', authRoute)



module.exports = router