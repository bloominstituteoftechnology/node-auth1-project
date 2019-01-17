const dbEnvironment = process.env.DB_ENVIRONMENT || "development";
const config = require("../knexfile")[dbEnvironment];

module.exports = require("knex")(config);
