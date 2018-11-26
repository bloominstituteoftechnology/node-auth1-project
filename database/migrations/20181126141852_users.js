
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', users => {
      users.increments();
      users.string('username', 100).notNullable().unique();
      users.string('password', 100).notNullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
