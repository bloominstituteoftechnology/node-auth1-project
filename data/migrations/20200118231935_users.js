exports.up = async knex => {
  await knex.schema.createTable("users", users => {
    users.increments();
    users
      .string("username", 100)
      .notNullable()
      .unique();
    users.string("password", 100).notNullable();
  });
};

exports.down = async knex => {
  await knex.schema.dropTableIfExists("users");
};
