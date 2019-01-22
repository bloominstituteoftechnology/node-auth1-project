exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", tbl => {
    tbl.increments(); // auto default to id column

    tbl
      .string("username", 255)
      .notNullable()
      .unique();
    tbl.string("name", 255).notNullable();
    tbl.string("password", 255).notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("users");
};
