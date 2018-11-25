exports.up = function(knex, Promise) {
  return knex.schema.createTable('Users', tbl => {
    tbl.increments();
    tbl
      .string('username')
      .notNullable()
      .unique();

    tbl.string('password').notNullable();

    tbl.string('Empty').defaultTo([]);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('Users');
};
