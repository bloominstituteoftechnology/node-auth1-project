// Update with your config settings.

module.exports = {
  development: {
    client: "sqlite3",
    useNullAsDefault:true,
    connection: {
      filename: "./data/authenticate.sqlite3"
    },
    migrations:{
      directory:"./data/migrations",
      tableName:"knex_migrations"
    },
    seeds:{
      directory:"./data/seeds"
    },
    pool: {
      afterCreate: (conn, done) => {
        conn.run('PRAGMA foreign_keys = ON', done);
      },
    },
  }
};
