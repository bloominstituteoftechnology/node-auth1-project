exports.up = function(knex, Promise) {
	return knex.schema.createTable('users', function(table) {
		table
			.increments();

		table
			.string('user', 128)
			.notNullable();
		
		table
			.string('hash', 255)
			.notNullable();

		table
			.unique('user');
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists('users');
};
