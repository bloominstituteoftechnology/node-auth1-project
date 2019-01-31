
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users',
    table => {
      tablele.increments()
      table.string('user_name', 128).notNullable().unique()
      table.string('password').notNullable()
    })
};

exports.down = function(knex, Promise) {
  return knex.schema.DropTableIfExists('users')
};
