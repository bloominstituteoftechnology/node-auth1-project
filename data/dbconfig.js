const knex = require("knex");

const knexfile = require("../knexfile.js");

// change to "production" and update knexfile.js to use postgres.
const knexConfig = knexfile.development;

module.exports = knex(knexConfig);