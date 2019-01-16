exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', users => {
    users.increment();
    users
      .string('username')
      .notNullable()
      .unique();
    users.string('password').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
