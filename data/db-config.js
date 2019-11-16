const knex = require("knex"),
  config = require("../knexfile");

module.exports = knex(config.development);
