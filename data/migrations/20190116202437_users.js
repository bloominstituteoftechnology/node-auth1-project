exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', table => {
        table.increments();
        table.string('user_name').notNullable().unique();
        table.string('password', 128).notNullable();
    })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
