exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(t) {
    t.increments('id').primary();

    t.string('username').notNullable();
    t.unique('username');

    t.string('password').notNullable();
  });
};

exports.down = function(knex, Promise) {};
