
exports.up = function(knex, Promise) {
  return knex.schema
  .createTable("users", tbl => {
      tbl.increments();
      tbl.string("username", 30)
      .notNullable()
      .unique()
      tbl.string("password")
  })
};

exports.down = function(knex) {
  return knex.schema
  .dropTableIfExists("Users")
};
