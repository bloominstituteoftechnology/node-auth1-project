exports.up = function(knex, Promise) {
    return knex.schema.createTable("users", users => {
      users.increments();
  
      users
        .string("username", 150)
        .notNullable()
        .unique();
      users.string("password", 150).notNullable();
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("users");
  };