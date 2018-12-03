module.exports = {
  development: {
    client: 'sqlite3',
    connection: { filename: './db/auth.sqlite3'},
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations/',
      tableName: './dbmigrations',
    },
    seeds: { directory: './db/seeds'},
  },
};