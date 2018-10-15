
exports.up = function(knex, Promise) {
    return knex.schema.table('users', function(users) {
        users.dropColumn('username');
        users.dropColumn('password');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
};