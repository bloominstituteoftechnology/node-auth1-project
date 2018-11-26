
exports.up = function (knex, Promise) {
    return knex.schema.createTable('users', users => {
        users.increments();

        users
            .string('username', 128)
            .unique()
            .notNullable();

        users
            .string('password')
            .notNullable();
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists('users');
};
