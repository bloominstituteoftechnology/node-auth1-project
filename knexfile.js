// Update with your config settings.

module.exports = {
  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './database/auth.db3',
    },
    migrations: {
      directory: "./database/migrations",
    },
    pool: {
      afterCreate: (conn, done) => {
        conn.run("PRAGMA foreign_keys = ON", done)
      },
    }
  },
};