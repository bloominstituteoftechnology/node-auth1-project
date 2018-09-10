
exports.up = function(knex, Promise) {
  return knex.schema.createTable('login', table => {
    // primary key
    table.increments()
    // username
    table.string('username', 128).notNullable().unique()
    // password
    table.string('password', 128).notNullable()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('login')
};
