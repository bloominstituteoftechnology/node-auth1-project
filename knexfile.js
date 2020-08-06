// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    useNotNullAsDefault: true,
    connection: {
      filename: './database/auth.db3',
    },

    pool: {
      afterCreate: (conn, done) => {
        conn.run('PRAGMA foreign_keys = ON', done);
      },
    },

    migrations: {
      directory: './database/migrations',
    },

    seeds: {
      directory: './database/seeds',
    },
  },

  production: {
    client: 'pg',
    connection: pgConnection,
    pool: {
      min: 2,
      max: 10
    },

    migrations: {
      tableName: './database/migrations',
    },

    seeds: {
      directory:'./database/seeds',
    },
  },

};
