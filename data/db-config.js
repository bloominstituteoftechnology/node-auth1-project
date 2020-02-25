const knex = require("knex");
const knexfile = require("../knexfile");

const environment = knex(knexfile.development);

module.exports = environment;
