exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", function(tbl) {
      tbl.increments('id');
      tbl
        .string('username')
        .notNullable()
        .unique('username');
      tbl
        .string('password')
        .notNullable()
        .unique('password');
  })
};
 exports.down = function(knex, Promise) {
  return knex.scheme.dropTable('users')
};

