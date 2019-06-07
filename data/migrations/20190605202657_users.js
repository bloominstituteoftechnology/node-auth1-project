exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", users => {
    //Creates an id, autoincrement, unique
    users.increments();

    users
      .string("username", 128)
      .unique()
      .notNullable();

    users.string("password", 128).notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("users");
};
