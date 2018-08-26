
exports.up = function(knex, Promise) {
  // create the users tables
  return knex.schema.createTable('users', function(tbl) {
    // primary key
    tbl.increments(); // creates an id (if you don't pass anything here the default name of the column will be 'id'), makes it integer, makes it autoincrement

    // other fields

    //username field
    tbl
        .string('username', 128)
        .notNullable()
        .unique();
        // .defaultTo('Not Prodivided');

    //password field
    tbl
      .string('password', 128)
      .notNullable();
  })
};

exports.down = function(knex, Promise) {
  // drop the users table
 return knex.schema.dropTableIfExists('users');
};
