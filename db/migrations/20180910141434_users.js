
exports.up = function(knex) {
  return knex.schema.createTable('users', users => {
    //ID  
    users.increments();

    //USERNAME
    users
      .string('username', 128)
      .notNullable()
      .unique();

    //PASSWORD
    users
      .string('password', 128).notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
