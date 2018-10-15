exports.up = knex =>
  knex.schema.createTable('users', table => {
    table.increments();
    table
      .string('username', 24)
      .notNullable()
      .unique();
    table.string('password', 128).notNullable();
  });

exports.down = knex => knex.schema.dropTableIfExists('users');
