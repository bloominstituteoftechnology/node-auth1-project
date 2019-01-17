exports.up = function (knex, Promise) {
    return knex.schema.createTable('users', function (table) {
        table.increments();
        table.string('user_name').notNullable();
        table.string('email').notNullable();
        table.string('name').notNullable();
        table.string('password').notNullable();
        table.string('role');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists('users');
};
