knexfile.js
module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/users.db'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './data/migrations'
    }
  }
}


users_table

exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table => {
    table.increments();
    table.string('username').notNullable();
    table.string('password').notNullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
