
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user', function(tbl) {
      tbl.increments().unique();
      tbl.string('userName', 50).notNullable().unique();
      tbl.string('password').notNullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('user')
};
