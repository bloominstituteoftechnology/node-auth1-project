exports.up = function(knex, Promise) {
  return knex.schema.createTable('Users', tbl => {
    tbl.increments();
    tbl
      .string('Username')
      .notNullable()
      .unique();

    tbl.string('Password').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('Users');
};
