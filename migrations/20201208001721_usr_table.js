
exports.up = function(knex) {
  return knex.schema.createTable('user_table', function(tbl){
    tbl.increments()
    tbl.text('Username')
    tbl.text('Password')
  })
};

exports.down = function(knex) {

  return knex.schema.dropTableIfExists('user_table')
  
};
