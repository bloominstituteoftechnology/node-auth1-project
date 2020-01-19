// Update with your config settings.

module.exports = {
  development: {
    // the DBMS driver
    client: "sqlite3",
    // location of the db
    connection: {
      filename: "./data/user.db3"
    },
    // necessary when using sqlite3 .
    useNullAsDefault: true,
    // migrations file path
    migrations: {
      directory: "./data/migrations"
    },
    // seeds file path
    seeds: {
      directory: "./data/seeds"
    }
  },
  pool: {
    // apply to be able to use foreign keys
    afterCreate: (conn, done) => {
      // runs after a connection is made to the sqlite engine.
      conn.run("PRAGMA foreign_keys = ON", done); // turn on FK enforcement
    }
  }
};
