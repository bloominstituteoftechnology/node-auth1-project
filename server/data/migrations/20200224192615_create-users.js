
exports.up = function(knex) {
  return knex.schema.createTable('users', users => {
      users.increments();
      users.text('username').notNullable(),
      users.text('password').notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
