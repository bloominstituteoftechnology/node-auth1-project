// Update with your config settings.

module.exports = {
  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './data/database.db3'
    }
  },
  migrations: {
    filename: './migrations'
  },
  seeds: {
    filename: './seeds'
  }
};