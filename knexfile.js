// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './database/dev.sqlite3'
    },
    useNullAsDefault: true, // used to avoid warning on console
    migrations: {
      directory: './database/migrations',
      tableName: 'dbmigrations',
    },
    seeds: { directory: './database/seeds' },
  }
  

};
