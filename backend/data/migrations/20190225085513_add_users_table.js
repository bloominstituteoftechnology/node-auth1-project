// Create/Delete the users table.

// Schema:
// 'id' - Primary integer incrementing
// email - 320-length unique index varchar
// username - 128-length unique index varchar
// password - 60-length binary
// permission - integer
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', table => {
        table.increments();
        table.string('email', 320);
        table.string('username', 128);
        table.string('password', 60);
        table.integer('permission');
        table.unique('email');
        table.unique('username');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
};
