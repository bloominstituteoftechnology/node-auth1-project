
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', table => {
        table.string('username')
            .primary()
            .unique()
            .notNullable();
        table.string('password')
            .notNullable();    
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
};
