require('dotenv').config();
module.exports = {
  development: {
    client: 'postgresql',
    version: '12.2',
    connection: {
      host:     process.env.HOST || '127.0.0.1',
      user:     process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DBNAME
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './database/migrations',
    },
    seeds: {
      directory: './database/seeds'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host:     process.env.HOST || '127.0.0.1',
      user:     process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DBNAME
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};