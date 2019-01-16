
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table => {
      table.increment();
      table.string('Username', 128).notnullable().unique();
      table.string('Password').notnullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
