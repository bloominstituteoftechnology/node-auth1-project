require('dotenv').config()

const express = require('express')
const logger = require('morgan')
const helmet = require('helmet')
const session = require('express-session')

module.exports = server => {
  server.use(express.json())
  server.use(logger('dev'))
  server.use(helmet())

  //* memory store
  server.use(
    session({
      secret: process.env.SECRET,
      httpOnly: true,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000
      }
    })
  )
}
