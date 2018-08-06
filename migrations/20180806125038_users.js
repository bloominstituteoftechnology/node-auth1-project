
exports.up = function(knex, Promise) {
	
return knex.schema.createTable('users', function(t) {
        t.increments('id').primary();

      t
      .text('username')
      .notNullable()
      .unique()
      .defaultTo('Not Provided');

      t
      .text('password')
      .notNullable()
      .defaultTo('Not Provided');
	
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
