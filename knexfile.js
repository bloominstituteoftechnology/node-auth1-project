// Update with your config settings.
require('dotenv').config();

const pgConnection = process.env.DATABASE_URL || 'postgresql://postgres@localhost/auth';
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
