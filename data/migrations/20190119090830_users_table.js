exports.up = function (knex, Promise) {
    return knex.schema.createTable('users', table => {
        table.increments();
        table.string('name').notNullable().unique();
        table.string('password').notNullable();
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists('users');
};