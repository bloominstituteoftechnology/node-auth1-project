
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', (tbl) => {
    tbl.increments('user_id');
    tbl.string('username', 255).notNullable().unique();
    tbl.string('password', 255).notNullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users')
};
