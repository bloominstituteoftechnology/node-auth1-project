
exports.up = function(knex, Promise) {
 return knex.schema.createTable('users', table=> {
     table.increments();
     table.string('username').notNullable();
     table.string('password').notNullable();
	 table.boolean('locked').defaultTo(false);
     table.timestamp('created_at').defaultTo(knex.fn.now());
 })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
