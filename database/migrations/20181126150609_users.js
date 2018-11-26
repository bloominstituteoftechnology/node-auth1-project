exports.up = (knex, Promise) => {
  return knex.schema.createTable('users', users => {
    users.increments();
    users
      .string('username', 128)
      .notNullable()
      .unique();
    users.string('password', 128).notNullable();
  });
};

exports.down = (knex, Promise) => knex.schema.dropTableIfExists('users');
