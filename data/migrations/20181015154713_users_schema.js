exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function(users) {
      users.increments();
  
      users.string('username', 30).notNullable().unique();
      users.string('password', 100).notNullable();
  
      
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
  };
  