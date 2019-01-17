// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './user-application.sqlite3'
    },
    useNullAsDefault: true,
    migrations: {
       directory: './data/migrations'
    },
    seeds: {
       directory: './data/seeds'
    }
  },

};
