
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', tbl => {
        tbl.increments('id').unique('id');
        tbl
            .string('username')
            .notNullable();
        tbl 
            .string('password')
            .notNullable();

    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
  
};
