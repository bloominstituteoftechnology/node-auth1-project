exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", function(table) {
    // pk
    table.increments();
    // other fields
    table.string("user_name", 256).notNullable();
    table.string("password").notNullable();
    table.string("email", 256).notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("users");
};
