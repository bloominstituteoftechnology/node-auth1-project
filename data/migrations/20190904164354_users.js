exports.up = function(knex) {
    return knex.schema.createTable('authentication', authentication => {
      authentication.increments();
  
      authentication
        .string('username', 12)
        .notNullable()
        .unique();
      authentication
        .string('password')
        .notNullable();
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('authentication');
  };
  