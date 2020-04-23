const knex = require("knex");

const knexConfig = require("../knexfile.js");

const environment = process.env.ENVIRONMENT || "development";

module.exports = knex(knexConfig[environment]);
