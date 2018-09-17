module.exports = {
  development: {
    client: 'sqlite3',
    connection: { filename: './database/auth.sqlite3' }, 
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations',
      tableName: 'dbmigrations',
    },
    seeds: { directory: './db/seeds' },
  },
};
