exports.up = function(knex) {
    return knex.schema.createTable('users', users => {
      users.increments(); //pk
  
      users
        .string('username', 133)
        .notNullable() //sets as required 
        .unique(); // creates index
      users.string('password', 133).notNullable();
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
  };