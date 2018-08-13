
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', user => {
      user.increments();

      user
      .string('username')
      .notNullable()
      

      user
      .string('password')
      .notNullable()
      
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
