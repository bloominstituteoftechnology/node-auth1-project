// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './data/dev.db3'
    },
    pool: {
      min: 2,
      max: 10,
      afterCreate:(conn, done) => {
        conn.run('PRAGMA foreign_keys = ON', done)
      }
    },
    migrations: {
      directory: './data/migrations',
      tableName: 'knex_migrations'
    },
    seeds:{
      directory: './data/seeds'

    }
  
  }

  };
