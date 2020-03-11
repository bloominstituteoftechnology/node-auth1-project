const knex = require("knex")
const knexfile = require("../knexfile").development;

module.exports = knex(knexfile)
