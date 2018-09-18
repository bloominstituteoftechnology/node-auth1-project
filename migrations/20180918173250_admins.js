exports.up = function(knex, Promise) {
  return knex.schema.createTable("admins", admins => {
    admins.increments;
    admins
      .integer("User_ID")
      .references("id")
      .inTable("users");
    admins.boolean("isAdmin").defaultsTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("admins");
};
