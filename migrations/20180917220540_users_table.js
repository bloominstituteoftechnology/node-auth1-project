
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(tbl) {
      tbl.increments();
      tbl
        .string('username')
        .notNullable()
        .defaultTo('Not Provided')

      tbl
        .string('password')
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};
