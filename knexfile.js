// Update with your config settings.

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./users.db3"
    },
    migrations: {
      directory: "./data/migrations"
    }
  }
};
