// Update with your config settings.


module.exports = {
  development: {
    client: 'sqlite3',
    //? s45 add useNullAsDefault: true
    useNullAsDefault: true,
    connection: {
      //? s46
      // filename: './dev.sqlite3'
      filename: './database/auth.db3'
    },
    //? s47
    migrations: {
      //? s47a term: knex (shows command)
      //? s47b term: knex migrate:make recipe-schema
      directory: './database/migrations'
    },
    //? s50 never created seeds
    seeds: {
      directory: './database/seeds',
    },
    //? s51 
    pool: {
      afterCreate: (conn, done) => {
        conn.run('PRAGMA foreign_keys = ON', done);
      },
    },
  },
};
