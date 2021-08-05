exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("user_id");
    table.string("username", 128).notNullable().unique().index();
    table.string("password", 128).notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
