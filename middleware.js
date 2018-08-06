const express = require('express')
const logger = require('morgan')
const helmet = require('helmet')

module.exports = (server) => {
  server.use(express.json())
  server.use(logger('dev'))
  server.use(helmet())
}
