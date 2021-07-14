// Update with your config settings.

module.exports = {
  development: {
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: "./database/usersAuth.db3",
    },
    migrations: {
      directory: "./database/migrations",
    },
    seeds: {
      directory: "./database/seeds",
    },
    pool: {
      afterCreate: (conn, done) => {
        // runs after a connection is made to the sqlite engine
        conn.run("PRAGMA foreign_keys = ON", done); // turn on FK enforcement
      },
    },
  },

  //testing
  testing: {
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: "./database/test.db3",
    },
    migrations: {
      directory: "./database/migrations",
    },
    seeds: {
      directory: "./database/seeds",
    },
    pool: {
      afterCreate: (conn, done) => {
        // runs after a connection is made to the sqlite engine
        conn.run("PRAGMA foreign_keys = ON", done); // turn on FK enforcement
      },
    },
  },
  //heroku  pd // if deployed, this will be stored in postgres, data will persist long term vs sqlite3 which doesn't persist long enough and it resets after some time. NOT IDEAL!!!!!heroku doesn't save the data in SQLITE, so if we add a user or resource, it will dissapear after a while, it's best to use postrgress and setting pg in the production section. the enviroments will be added by heroku once deployed
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./database/migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./database/seeds",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};
