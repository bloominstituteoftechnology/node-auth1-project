exports.up = function(knex, Promise) {
	return knex.schema.createTable('users', function(table) {
		table
			.increments();

		table
			.string('username', 128)
			.notNullable();
		
		table
			.string('password', 255)
			.notNullable();

		table
			.unique('username');
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists('users');
};
