// Create/Delete the sessions table.

// Schema:
// 'id' - Primary integer incrementing
// user_id - Foreign unique index integer (references users.id)
// expire_date - date of expiration.

exports.up = function(knex, Promise) {
    return knex.schema.createTable('sessions', table => {
        table.increments();
        table.integer('user_id').references('id').inTable('users');
        table.datetime('expire_date');
        table.unique('user_id');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('sessions');
};
