exports.up = function(knex, Promise) {
  return knex.createTable("users", function(tbl) {
    tbl.increments();
    tbl
      .string("username", 128)
      .notNullable()
      .unique();
    tbl.string("password").notNullable();
  });
};

exports.down = function(knex, Promise) {
  //return knex.schema.dropTable("users")
  return knex.schema.dropTableIfExists("users");
};
