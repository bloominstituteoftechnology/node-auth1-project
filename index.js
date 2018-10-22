const express = require('express')
const helmet = require('helmet')

const knex = require('knex')
const knexConfig = require('./knexfile.js')
const session = require('express-session')

const port = 9000
const db = knex(knexConfig.development)
const server = express()

server.use(express.json())
server.use(helmet())

server.use(session({
    name: 'panda', // default is connect.sid
    secret: 'bamboo rules',
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        secure: false, // only set cookies over https. Server will not send back a cookie over http.
      },