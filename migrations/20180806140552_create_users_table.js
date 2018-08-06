exports.up = function(knex, Promise) {
  return knex.schema.createTable("Users", table => {
    table.increments();
    table.string("user").notNullable();
    table.string("password").notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("Users");
};
