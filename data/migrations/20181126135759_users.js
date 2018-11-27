exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', users => {
        users.increments();
    
        users
            .string('username', 128) // the type of input 
            .notNullable() // cannot be empty 
            .unique(); // cannot have duplicates

            // password
        users.string('password', 128).notNullable();
    });
};
exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
}; 