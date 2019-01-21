exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(tbl) {
    // primary key
    tbl.increments(); // defaults to a column named id

    // other fields
    tbl.string('userName', 128);
    tbl.string('password');

    // timestamps
    tbl.timestamps(true, true);

  });

};

exports.down = function(knex, Promise) {
  // rollback/undo the changes
  return knex.schema.dropTableIfExists('users');
};