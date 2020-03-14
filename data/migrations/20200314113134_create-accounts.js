exports.up = function(knex) {
  return knex.schema.createTable("accounts", table => {
    table
      .increments("id");
    table
      .text("user_name")
      .notNullable()
      .unique();
    table
      .text("password")
      .notNullable();
  });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('accounts')  
};
