module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./database/sqlite3"
    },
    useNullAsDefault: true
  },
  migrations: {
    directory: "./database/migrations"
  }
};
