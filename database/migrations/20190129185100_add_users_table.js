
exports.up = function(knex, Promise) {
    return knex.schema.createTable('projects', tbl => {
        tbl.increments();

        tbl
            .string('username', 128)
            .notNullable()
            .unique();
        
        tbl
            .string('password', 128)
            .notNullable();
        
        tbl
            .string('firstName', 128)
            .notNullable();
        
        tbl
            .string('lastName', 128)
            .notNullable();
        
        tbl
            .timestamp('createdAt')
            .defaultTo(knex.fn.now());
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
};
