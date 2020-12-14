const knex = require('knex')
const config = require('../knexfile.js')
const db = knex(config.development)

module.exports = db