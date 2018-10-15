
module.exports = {
  development: {
   client: 'sqlite3', // tells knex that we're using the SQLite3 driver we installed via yarn
   connection: {
     filename: './data/lambda.sqlite3' // update this with the location of your database file
   },
   useNullAsDefault: true, // new configuration for SQLite
   migrations: {
     directory: './data/migrations',
   },
   seeds: {
     directory: './data/seeds',
   },
 },

}