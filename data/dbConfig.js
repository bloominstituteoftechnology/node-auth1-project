const knex = require("knex");

const dbConfig = {
    client: "sqlite3",
    connection: {
        filename: "./data/users.db3",
    },
    useNullAsDefault: true,

    migrations: {
        directory: "./data"
    },

    // pool: {
    //     afterCreate: (conn, done) => {
    //         conn.run('PRAGMA foreign_keys = ON', done);
    //     }
    // }


};

module.exports = knex(dbConfig);