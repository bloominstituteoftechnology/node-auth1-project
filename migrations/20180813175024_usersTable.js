
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(tbl){
    tbl.increments();
    tbl.string('username').unique()
    tbl.string('password');
  });
};

exports.down = function(knex, Promise) {
  
};
