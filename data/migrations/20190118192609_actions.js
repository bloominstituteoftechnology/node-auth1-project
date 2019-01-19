exports.up = function(knex, Promise) {
  return knex.schema.createTable("actions", table => {
    table.increments();
    table.string("action_description").notNullable();
    table.string("notes", 10000);
    table.boolean("action_complete").defaultTo(false);
    table
      .integer("project_id")
      .unsigned()
      .notNullable();
    table
      .foreign("project_id")
      .references("id")
      .on("projects");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("actions");
};
