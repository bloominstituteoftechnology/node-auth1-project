const knex = require('knex')
const config = require('../knexfile.js')

// Select development object 
const db = knex(config.development)

module.exports = db