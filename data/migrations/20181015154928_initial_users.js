
exports.up = function(knex, Promise) {
    // Create User Table
  return knex.schema.createTable('user', userTableObject => {
    // Primary Id Field  
    userTableObject.increments('id');

    // Username Field
    userTableObject.string('username', 128)
    .unique()
    .notNullable();

    // Password Field
    userTableObject.string('password', 128)
    .notNullable();
  })
};

exports.down = function(knex, Promise) {
    // Drop User Table
  return knex.shema.dropTableIfExists('user');
};
