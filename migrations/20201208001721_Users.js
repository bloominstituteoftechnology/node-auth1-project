
exports.up = function(knex) {
  return knex.schema.createTable('Users', function(tbl){
    tbl.increments('id')
    tbl.text('Username')
    .unique()
    .notNullable()
    tbl.text('Password')
    .notNullable();
  })
};

exports.down = function(knex) {

  return knex.schema.dropTableIfExists('Users')
  
};
