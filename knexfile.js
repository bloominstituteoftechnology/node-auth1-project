// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './db/dev.sqlite3'
    },
    useNullAsDefault:true,
    seeds: {
			directory: './db/seeds'
    },
    
  migrations: {
    directory: './db/migrations'
  }
}
};