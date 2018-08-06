
exports.up = function(knex, Promise) {
	
return knex.schema.createTable('users', function(user) {
        user.increments('id').primary();

      user
      .text('username')
      .notNullable()
      .unique()
      .defaultTo('Not Provided');

      user
      .text('password')
      .notNullable()
      .defaultTo('Not Provided');
	
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
