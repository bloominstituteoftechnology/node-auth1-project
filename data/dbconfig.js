const knex = require("knex");

const config = require("../knexfile.js");
// the development object from our knexfile.
const db = knex(config.development);
// exporting for use.
module.exports = db;
