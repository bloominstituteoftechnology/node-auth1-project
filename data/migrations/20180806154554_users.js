
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(tbl) {
    tbl.increments();

    tbl.string('username')
    .notNullable()
    .unique();
    tbl.string('password')
    .notNullable();

    tbl.string('role')
    .notNullable()
    .defaultTo('free');
  });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');

};
