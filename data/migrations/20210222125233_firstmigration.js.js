
exports.up = function(knex) {
  return knex.schema
  .createTable('roles', tbl =>{
      tbl.increments();
      tbl.string('name', 130).notNullable().unique();
  })
  .createTable('users', tbl =>{
      tbl.increments();
      tbl.string('username', 130).notNullable().unique().index();
      tbl.string('password', 260).notNullable();
      tbl
        .integer("role")
        .unsigned()
        .references("roles.id")
        .onDelete("RESTRICT")
        .onUpdate("CASCADE");
  })
};

exports.down = function(knex) {
  return knex.schema
  .dropTableIfExists('users')
  .dropTableIfExists('roles')
};
