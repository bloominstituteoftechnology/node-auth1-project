
exports.up = function(knex, Promise) {
   return knex.schema.createTable('clients', function (clients) {
    clients.increments();

    clients
    .string('username',128)
    .notNullable()
    .unique();
    
    clients
    .string('password',128)
    .notNullable();
  });
};

exports.down = function(knex, Promise) {
   return knex.schema.dropTableIfExists('clients');
};
