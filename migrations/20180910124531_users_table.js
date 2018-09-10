
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', users => {

    users.increments();

    users.string('username', 128).notNullable().unique('user_username');
    users.string('password', 128).notNullable().unique('user_password');

  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
