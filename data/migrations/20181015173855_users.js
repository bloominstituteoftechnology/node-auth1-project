exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", table => {
    table.increments();
    table.string("username").notNullable();
    table.string("password").notNullable();
  });
};
 
exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists();
};