exports.up = function(knex, Promise) {
	return knex.schema.createTable("users", function(tbl) {
		tbl.increments();
		tbl.string("username", 20).notNullible();
		tbl.string("password", 255).notNullible();
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists("users");
};
