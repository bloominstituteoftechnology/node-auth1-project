
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(users) {
    users.increments();

    users.text('username',126)
    .unique()
    .notNullable();

    users.text('password')
    .notNullable()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
