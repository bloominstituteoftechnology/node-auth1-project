const knex = require("knex")

const knexfile = require("../knexfile");
const environment = process.env.Node_ENV || 'development';

module.exports = knex(knexfile[environment])

