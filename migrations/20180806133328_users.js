
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', tbl => {
      tbl.increments();
      tbl.string('userName').notNullable().unique();
      tbl.string('userLogged');
  })
};

exports.down = function(knex, Promise) {
  
};
