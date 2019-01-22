// Update with your config settings.

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./database/db.sqlite3"
    },
    useNullAsDefault: true, // used to avoid warning on console
    migrations: {
      directory: "./database/migrations"
      //tableName: 'dbmigrations',
    },
    seeds: { directory: "./database/seeds" }
  }
};
