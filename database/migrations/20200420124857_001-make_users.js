exports.up = function (knex) {
	return knex.schema.createTable('accounts', tbl => {
		tbl.increments().primary();
		tbl.string('username', 72).notNullable().index();
		tbl.string('password', 2048).notNullable();
	});
};

exports.down = function (knex) {
	return knex.schema.dropTableIfExists('accounts');
};
