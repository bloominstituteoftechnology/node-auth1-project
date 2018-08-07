require('dotenv').config()

const express = require('express')
const knex = require('knex')
const logger = require('morgan')
const helmet = require('helmet')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)

const db = './data/db.sqlite3'
const store = new KnexSessionStore({
  knex: knex({
    client: 'sqlite3',
    connection: {
      filename: './connect-session-knex.sqlite'
    },
    useNullAsDefault: true
  })
})

module.exports = (server) => {
  server.use(express.json())
  server.use(logger('dev'))
  server.use(helmet())
  server.use(session({
    secret: process.env.SECRET,
    store: store,
    cookie: {
      maxAge: 10 * 60 * 1000,
      secure: true
    }
  }))
  //* memory store
  // server.use(session({
  //   name: 'tacos',
  //   secret: process.env.SECRET,
  //   httpOnly: true,
  //   secure: true,
  //   resave: false,
  //   saveUninitialized: false,
  //   cookie: {
  //   maxAge: 10 * 60 * 1000,
  //   secure: true,
  //   }
  // }))
}
