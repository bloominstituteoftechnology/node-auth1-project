
exports.up = function(knex, Promise) {
  return knex.schema.createTable('accounts', eachUser => {
    eachUser.increments();
    eachUser.string('username').notNullable().unique();
    eachUser.string('password').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('accounts');
};
