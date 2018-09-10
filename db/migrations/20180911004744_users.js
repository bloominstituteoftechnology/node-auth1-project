exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table.increments();

    table
      .string('username', 128)
      .notNullable()
      .unique('username');
    table.string('password', 128).notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
