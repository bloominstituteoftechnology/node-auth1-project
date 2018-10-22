const express = require('express')
const helmet = require('helmet')

const knex = require('knex')
const knexConfig = require('./knexfile.js')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)
const port = 9000
const db = knex(knexConfig.development)
const server = express()

server.use(express.json())
