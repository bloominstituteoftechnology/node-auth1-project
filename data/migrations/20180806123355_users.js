exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(t) {
    t.increments(); // PK defaults to 'id'
    t.string('name')
      .unique()
      .notNullable();
    t.string('password').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
