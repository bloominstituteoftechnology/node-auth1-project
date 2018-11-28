//* Third-party middleware
const config = require('../config')
const express = require('express')
const logger = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const RateLimit = require('express-rate-limit')
const session = require('express-session')

const apiLimiter = new RateLimit(config.rateLimit)

const KnexSessionStore = require('connect-session-knex')(session)
const store = new KnexSessionStore(config.knexSessionStore)

module.exports = server => {
  server.use(express.json())
  server.use(logger('dev'))
  server.use(helmet())
  server.use(cors({ origin: 'http://localhost:3000', credentials: true }))
  server.use(apiLimiter)
  server.use(
    session({
      ...config.expressSession,
      store: store
    })
  )
}
