
exports.up = function(knex, Promise) {
  return knex.schema.createTabel('user', function(tbl) {
      tbl.increment().unique();
      tbl.string('userName', 50).notNullable();
      tbl.text('password').notNullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('user')
};
