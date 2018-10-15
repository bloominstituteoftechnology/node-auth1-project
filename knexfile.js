module.exports = {
  development: {
    client: 'sqlite3',
    connection: { filename: './data/auth.sqlite3' }, // change this if you want a different name for the database
    useNullAsDefault: true, // used to avoid warning on console
    migrations: {
      directory: './data/migrations',
      tableName: 'dbmigrations',
    },
    seeds: { directory: './data/seeds' },
  },
};