
exports.up = function(knex,promise) {
    return knex.schema
    .createTable('users',tbl=>{
        tbl.increments();
        tbl.string('username',15).notNullable().unique();
        tbl.string('password',15).notNullable();
    })
  };
  
  exports.down = function(knex,promise) {
    return knex.schema
    .dropTableIfExists('users')
  };
