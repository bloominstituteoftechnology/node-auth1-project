const knex = require("knex");
const knexfile = require("../knexfile.js");

module.exports = knex(knexfile.development);
