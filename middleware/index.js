require('dotenv').config()
//* Third-party middleware
const config = require('../config')
const express = require('express')
const logger = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)

const store = new KnexSessionStore(config.knexSessionStore)

module.exports = server => {
  server.use(express.json())
  server.use(logger('dev'))
  server.use(helmet())
  server.use(cors({ origin: 'http://localhost:3000', credentials: true }))

  //* session config to use SQLITE3
  server.use(
    session({
      ...config.expressSession,
      store: store
    })
  )
}
