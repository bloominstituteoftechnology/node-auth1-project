
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(tbl) {
    tbl.increments('id').unique().unsigned().primary();
    tbl.string('user_id').unique();
    tbl.string('password');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExist('users');
};
