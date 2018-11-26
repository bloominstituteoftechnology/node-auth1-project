
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(tbl) {
      tbl.increments();
      tbl.string('user', 128).unique();
      tbl.string('password', 255)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
