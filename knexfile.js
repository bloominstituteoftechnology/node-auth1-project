module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/name.db3',
    },
    migrations: {
      directory: "./data/migrations",
    },
    seeds: {
      directory: "./data/seeds",
    },
    useNullAsDefault: true,
    },
    pool: {
      afterCreate: (conn, done) => {
        conn.run("PRAGMA foreign_key = ON", done);
      },
    },
};