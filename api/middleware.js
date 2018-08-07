require('dotenv').config()
const express = require('express')
const logger = require('morgan')
const helmet = require('helmet')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)

module.exports = (server) => {
  server.use(express.json())
  server.use(
    session({
      name: 'sliturbrain',
      secret: 'secret',
      store: new KnexSessionStore(),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        secure: true
      }
    })
  )
  server.use(logger('dev'))
  server.use(helmet())
}
