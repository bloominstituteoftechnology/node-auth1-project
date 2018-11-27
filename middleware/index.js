require('dotenv').config()
//* Third-party middleware
const express = require('express')
const logger = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const session = require('express-session')

module.exports = server => {
  server.use(express.json())
  server.use(logger('dev'))
  server.use(helmet())
  server.use(cors())

  //* memory store
  server.use(
    session({
      name: 'tacos',
      secret: process.env.SECRET,
      httpOnly: true,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 5 * 1000
      }
    })
  )
}
