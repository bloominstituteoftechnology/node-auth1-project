
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function(tbl) {
        tbl.increments();
        tbl
            .string('username', 24)
            .notNullable()
            .unique();            
        tbl.string('password', 128).notNullable()
  })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');
};
