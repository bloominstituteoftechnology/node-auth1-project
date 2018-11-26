// Update with your config settings.

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/db.sqlite3'
    },
    useNullAsDefault: true,
    seeds: {
      directory: './data/seeds'
    },
    migrations: {
      directory: './data/migrations'
    }
  }
}
