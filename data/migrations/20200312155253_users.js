exports.up = async function(knex) {
	await knex.schema.createTable('users', (tbl) => {
		tbl.increments();
		tbl.text('userName');
		tbl.text('password');
	});
};

exports.down = async function(knex) {
	await knex.schema.dropTableIfExists('users');
};
