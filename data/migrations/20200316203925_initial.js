exports.up = async function(knex) {
	await knex.schema.createTable("users", users => {
		users.increments();

		users
			.string("username", 128)
			.notNullable()
			.unique();
		users.string("password", 128).notNullable();
	});
};

exports.down = async function(knex, Promise) {
	await knex.schema.dropTableIfExists("users");
};
