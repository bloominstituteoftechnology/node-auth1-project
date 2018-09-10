// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true,
    connection: {
      filename: './db/lambda.sqlite3'
    }
  },
};
