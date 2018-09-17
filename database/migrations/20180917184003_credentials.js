
exports.up = function(knex, Promise) {
  return knex.schema.createTable('credentials', t=> {
    t.increments();
    t
    .string('username', 16)
    .notNullable()
    .unique()
    t
    .string('password')
    .notNullable
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('credentials')
};
