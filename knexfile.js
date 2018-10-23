module.exports = {
   development: {
    client: 'sqlite3',
    connection: {
      filename: './users.sqlite3'
    },
    migrations: {
      filename: './data/migrations'
    },
    seeds: {
      filename: './data/seeds'
    }
  }
}
