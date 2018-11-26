
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', users => {
      users.increments();

      users
        .string('username', 200)
        .notNullable()
        .unique();
    users
        .string('password', 200)
        .notNullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
