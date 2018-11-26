exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table => {
    // id
    table.increments();
    // username (string, required, unique)
    table
      .string('username', 255)
      .notNullable()
      .unique();
    // password (string, required)
    table.string('password', 255).notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
