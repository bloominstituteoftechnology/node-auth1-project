exports.up = function(knex, Promise) {
  // makes the changes to the database
  return knex.schema.createTable('users', function(tbl) {
    // make changes to the table using the tbl object passed as a parameter

    // primary key
    tbl.increments(); // generate an id field and make it autoincfement and the primary key

    // other fields
    tbl
      .string('username', 255)
      .unique()
      .notNullable();
    tbl.string('password', 255).notNullable();
  });
};

exports.down = function(knex, Promise) {
  // undo the changes to the database (it's called rolling back changes)
  return knex.schema.dropTableIfExists('users');
};
