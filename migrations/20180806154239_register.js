
exports.up = function(knex, Promise) {
    return knex.schema.createTable('register', function(register) {
        register.increments();

        register
            .string("username")
            .notNullable()

        register
            .string("password")
            .notNullable()
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('register');
};
