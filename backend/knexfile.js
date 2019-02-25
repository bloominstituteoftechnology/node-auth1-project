module.exports = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: './data/users.sqlite3',
        },
        useNullAsDefault: true,
        pool: {
            afterCreate: (conn, done) => {
                conn.run('PRAGMA foreign_keys = ON', done);
            },
        },
        migrations: {
            directory: './data/migrations',
            tableName: 'knex_migrations',
        }
    }
};
