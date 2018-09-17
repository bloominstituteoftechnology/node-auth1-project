const knex = require("knex");
const dbConfig = require("../../knexfile");
const db = knex(dbConfig.development);

module.exports = {
  // We are not doing a lot of endpoints it doesn't sound like
  // but I want to be in the habbit of creating my functions here.
};
