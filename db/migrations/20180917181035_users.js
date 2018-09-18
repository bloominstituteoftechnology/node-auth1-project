
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', (tbl) => {
    tbl
    .increments()

    tbl
    .string('username', 128)
    .notNullable()
    .unique('username');

    tbl
    .string('password', 128)
    .notNullable()
    
    })     
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users')
 
};
