require('dotenv').config()

const express = require('express')
const logger = require('morgan')
const helmet = require('helmet')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)

// const db = './data/db.sqlite3'
const store = new KnexSessionStore()

module.exports = (server) => {
  server.use(express.json())
  server.use(logger('dev'))
  server.use(helmet())

  //* database store
  server.use(session({
    name: 'tacos',
    secret: process.env.SECRET,
    store: store,
    resave: false,
    httpOnly: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 10 * 60 * 1000,
      secure: true
    }
  }))

  // //* memory store
  // server.use(session({
  //   name: 'tacos',
  //   secret: process.env.SECRET,
  //   httpOnly: true,
  //   resave: false,
  //   saveUninitialized: false,
  //   cookie: {
  //     maxAge: 10 * 60 * 1000
  //     // secure: true
  //   }
  // }))
}
