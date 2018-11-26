exports.up = function(knex, Promise) {
  return knex.schema.createTable('user_info', (users) => {
    users.increments();
    users
      .string('username', 160)
      .notNullable()
      .unique();
    users.string('password', 160).notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('user_info');
};
