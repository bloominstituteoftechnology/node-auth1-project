
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(tbl) {
      tbl.increments();

      tbl
        .string('user', 128)
        .notNullable()
        .defaultTo('not provided');

      tbl
        .string('password', 128);
        .notNullable()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
