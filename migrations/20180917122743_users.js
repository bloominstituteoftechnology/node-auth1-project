
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(tbl) {
      tbl.increments();

      tbl
      .string('username', 14)
      .unique()
      .notNullable();

      tbl
      .string('password')
      .notNullable()l
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
