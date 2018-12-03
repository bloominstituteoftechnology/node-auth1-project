
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', users => {
    //create primary key for table
    users.increments();

    //create username reqs
    users.string('username', 24)
      .notNullable() //cant be empty
      .unique() //cant match any other username

    //create password reqs
    users.string('password')
      .notNullable()
  })
  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
