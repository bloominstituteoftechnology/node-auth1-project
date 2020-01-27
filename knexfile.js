// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/users.db3'
    }
  },
  migrations: {
    directory: './data/migrations'
  },
  migrations: {
    seeds: './data/seeds'
  },
  
    // necessary when using sqlite3
    useNullAsDefault: true

};
