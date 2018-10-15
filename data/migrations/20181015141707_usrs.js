
exports.up = function(knex, Promise) {
  return knex.schema.createTable('usrs', function(tbl) {
      tbl.increments().primary();

      tbl.string('usrs_nme').notNullable();
      tbl.string('usrs_pwd').notNullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('usrs');
};
