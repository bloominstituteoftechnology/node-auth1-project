const config = require("../knexfile.js");

const knex = require("knex");

module.exports = knex(config.development);
