
exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', function (projects) {
    users.increments();
    users.string('username', 128).notNullable();
    users.string('password').notNullable();
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
