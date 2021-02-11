
exports.up = function(knex) {
  return knex.schema.createTable('Users', function(tbl){
    tbl.increments('id')
    tbl.text('username')
    .unique()
    .notNullable()
    tbl.text('password')
    .notNullable();
  })
};

exports.down = function(knex) {

  return knex.schema.dropTableIfExists('Users')
  
};
