exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", function(table) {
    table.increments();
    table
      .string("username", 255)
      .unique()
      .notNullable();
    table.string("password", 255).notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExits("users");
};
