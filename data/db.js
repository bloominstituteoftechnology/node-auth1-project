const knex = require('knex')
const { development: config } = require('../knexfile.js')

module.exports = knex(config)
