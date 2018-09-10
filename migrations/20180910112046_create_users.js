
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', tbl => {
    tbl.increments();
    tbl.string('Username', 128).notNullable().unique();
    tbl.string('Password', 128).notNullable().unique();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
