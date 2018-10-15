
exports.up = function(knex, Promise) {
    return knex.schema.table('users', function(users) {
        users
            .string('username', 20)
            .notNullable()
            .defaultTo('username')
            .unique();
        users
            .string('password', 255);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
};