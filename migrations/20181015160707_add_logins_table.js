
exports.up = function(knex, Promise) {
  return knex.schema.createTable('data', function(data){
      data.increments();
      data.string('username', 128).notNullable().unique();
      data.string('password').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('data');
};
