
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', user => {
    user.increments();
    user.string('username').notNullable().unique();
    user.string('password').notNullable().unique();
  })
};

exports.down = function(knex, Promise) {
  
};
