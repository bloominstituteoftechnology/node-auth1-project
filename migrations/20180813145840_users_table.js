exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", users => {
    users.increments();

    users.text("username").notNullable();
    users.text("password").notNullable();

    users
      .dateTime("created_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"));
  });
};

exports.down = function(knex, Promise) {
  return knex.dropTableIfExists("users");
};
