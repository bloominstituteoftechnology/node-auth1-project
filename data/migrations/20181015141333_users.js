exports.up = function(knex, Promise) {
	return knex.schema.createTable('users', function(tbl) {
		tbl.increments();
		tbl
			.string('name')
			.unique()
			.notNullable();
		tbl.string('password').notNullable();
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists('users');
};
