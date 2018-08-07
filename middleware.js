require('dotenv').config()

const express = require('express')
const logger = require('morgan')
const helmet = require('helmet')
const session = require('express-session')

module.exports = (server) => {
  server.use(express.json())
  server.use(logger('dev'))
  server.use(helmet())
  server.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
  }))
}
