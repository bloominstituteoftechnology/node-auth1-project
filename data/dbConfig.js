const knex = require("knex")
const knexfile = require("../knexfile")

// selects development object from knexfile
const db = knex(knexfile.development)

module.exports = db