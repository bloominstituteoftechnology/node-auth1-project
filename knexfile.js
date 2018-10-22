// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './data.sqlite3'
    },
    migrations: {
      directory: './data/migrations'
    },
    useNullAsDefault: true,
  },

};
