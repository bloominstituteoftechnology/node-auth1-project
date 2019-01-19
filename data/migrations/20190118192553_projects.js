exports.up = function(knex, Promise) {
  return knex.schema.createTable("projects", table => {
    table.increments();
    table
      .string("name")
      .unique()
      .notNullable();
    table.string("description");
    table
      .integer("user_id")
      .unsigned()
      .notNullable();
    table
      .foreign("user_id")
      .references("id")
      .on("users");
    table.boolean("completed").defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("projects");
};
