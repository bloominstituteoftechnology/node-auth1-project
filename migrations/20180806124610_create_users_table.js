
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(tbl) {
  	tbl.increments();
  	tbl
  		.string('name')
  		.notNullable()
  		.unique();
  	tbl
  		.string('password', 14)
  		.notNullable();

  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
