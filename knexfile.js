// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/users.sqlite3'
    },
    migrations: {
      directory: './data/migrations/'
    },
    seeds: {
      directory: './data/seeds/'
    },
    useNullAsDefault: true
  },

};
