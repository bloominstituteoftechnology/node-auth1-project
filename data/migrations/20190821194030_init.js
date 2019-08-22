
exports.up = function(knex) {
  return knex.schema
    .createTable('users', (tbl) => {
      tbl.increments('id');
      tbl.string('username', 25)
        .unique()
        .notNullable();
      tbl.string('password')
        .notNullable();
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('users');
};
