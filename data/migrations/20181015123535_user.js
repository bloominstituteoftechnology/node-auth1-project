exports.up = function(knex, Promise) {
	return knex.schema.createTable("users", function(tbl) {
		tbl.increments();
		tbl.string("username", 20).notNullable();
		tbl.string("password", 255).notNullable();
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists("users");
};
