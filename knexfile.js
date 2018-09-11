// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: { filename: './db/auth.sqlite3' }, 
    useNullAsDefault: true, 
    migrations: {
      directory: './db/migrations',
      tableName: 'users',
    },
  }

};
