exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function(users) {
        users.increments();
    
        users.string('username').notNullable();
        users.string('password', 14).notNullable();
        users.boolean('completed').defaultTo(false);
      });
};

exports.down = function(knex, Promise) {
return knex.schema.dropTableIfExists('users');
};