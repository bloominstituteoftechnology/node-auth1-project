
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', tbl =>{
      tbl.increments();
      tbl.string('username', 250).notNullable();
      tbl.string('password', 500).notNullable();
  })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExist('users');
};
