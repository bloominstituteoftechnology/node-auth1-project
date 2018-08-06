exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id')
    table.string('username').notNullable()
    table.string('password').notNullable()
    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now())
  })
};

exports.down = function(knex, Promise) {
  return knex.dropTableIfExists('users') 
};
