exports.up = function(knex, Promise) {
  knex.schema.createTable("users", table => {
    table.increments();
    table
      .string("username")
      .notNullable()
      .unique();
    table.string("password").notNullable();
  });
};

exports.down = function(knex, Promise) {
    knex.schema.dropTableIfExists('users')
};
