exports.up = function(knex, Promise) {
  return knex.schema.createTable("projects", function(tbl) {
    tbl.increments();
    tbl.string("name", 255).notNullable();
    tbl.string("password", 255).notNullable();
    tbl.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("projects");
};
