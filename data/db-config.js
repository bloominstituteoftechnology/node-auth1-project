require("dotenv").config();
const knex = require("knex");

const config = require("../knexfile.js");

module.exports = knex(config[process.env.NODE_ENV || "development"]);