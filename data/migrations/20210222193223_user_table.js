
exports.up = function(knex) {
  return knex.schema
      .createTable('roles', table => {
          table.increments()
          table.string('name', 128).notNullable().unique()
      })
      .createTable('users', table => {
          table.increments()
          table.string('username', 128).notNullable().unique().index();
          table.string('password', 256).notNullable();
          table.integer('role').unsigned().references('roles.id').onDelete('RESTRICT').onUpdate('CASCADE');
      });
};

exports.down = function(knex) {
return knex.schema
  .dropTableIfExists('roles')
  .dropTableIfExists('users')
};
