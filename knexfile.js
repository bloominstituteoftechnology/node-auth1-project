// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './database/authmcauthface.sqlite3'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './database/migrations'
    }
  },
};
