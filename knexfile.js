// Update with your config settings.
//EXPORTS
module.exports = {

  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './data/authData.db3'
    },
    pool: {
      afterCreate: ( conn, done ) => {
        conn.run( ' PRAGMA foreign_keys = ON ' , done )
      },
    },
    migrations: {
      directory: './data/migrations'
    },
  }
};
