module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./data/app.db.sqlite3"
    },
    migrations: {
      directory: "./data/database/migrations/"
    },
    seeds: {
      directory: "./data/seeds/"
    },
    useNullAsDefault: true
  }
};
