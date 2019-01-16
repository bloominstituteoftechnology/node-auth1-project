
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', users => {
    users.increments();
    users.string('username').notNullable();
    users.string('password').notNullable().unique();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
