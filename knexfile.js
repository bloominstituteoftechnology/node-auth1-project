// Update with your config settings.

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./data/business.db3"
    },
    useNullAsDefault: true
  },
  migrations: {
    directory: "./migrations"
  },
  seeds: {
    directory: "./data/seeds"
  }
};
