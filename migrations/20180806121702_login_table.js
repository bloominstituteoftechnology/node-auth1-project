exports.up = function(knex, Promise) {
  return knex.schema.createTable("login", tbl => {
    tbl.increments();
    tbl
      .string("login_username")
      .unsigned()
      .notNullable()
      .references("username")
      .inTable("register")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    tbl
      .string("login_password")
      .unsigned()
      .notNullable()
      .references("password")
      .inTable("register")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("login");
};
