exports.up = function(knex, Promise) {
	return knex.schema.createTable('students', (student) => {
		student.increments();
		student.string('username', 128).notNullable().unique();
		student.string('password', 128).notNullable();
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists('students');
};
