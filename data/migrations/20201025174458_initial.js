exports.up = async function (knex) {
  await knex.schema.createTable("recipe", (table) => {
    table.increments("id");
    table.text("name").notNull();
  });

  await knex.schema.createTable("directions", (table) => {
    table.increments("id");
    table.integer("order").notNull();
    table.text("direction").notNull();
    table
      .integer("recipe_id")
      .references("id")
      .inTable("recipe")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });

  await knex.schema.createTable("ingredient", (table) => {
    table.increments("id");
    table.text("name").notNull();
  });

  await knex.schema.createTable("recipe_ingredient", (table) => {
    table
      .integer("recipe_id")
      .references("id")
      .inTable("recipe")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    table
      .integer("ingredient_id")
      .references("id")
      .inTable("ingredient")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("recipe_ingredient");
  await knex.schema.dropTableIfExists("ingredient");
  await knex.schema.dropTableIfExists("directions");
  await knex.schema.dropTableIfExists("recipe");
};
