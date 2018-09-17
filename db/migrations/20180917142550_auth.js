
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function(tbl) {
        tbl.increments();
  
        tbl.string('name', 128).notNullable().unique('user_name');
  
        tbl.string('password', 128).notNullable();
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users')
};
