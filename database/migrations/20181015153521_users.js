
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function(users) {
        users
            .increments();
        users
            .string('username', 20)
            .notNullable();
        users
            .string('password', 255)
            .notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
};