
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(tbl) {
    tbl.increments();

    tbl
      .string('username', 255)
      .notNullable()
      .unique('uq_username');

    tbl
      .string('password')
      .notNullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
