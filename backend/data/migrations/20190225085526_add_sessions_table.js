// Create/Delete the sessions table.

// Schema:
// 'id' - Primary integer incrementing
// user_id - Foreign unique index integer (references users.id)
// session_key - 96-varchar string, unique index
// expire_date - date of expiration.

exports.up = function(knex, Promise) {
    return knex.schema.createTable('sessions', table => {
        table.increments();
        table.integer('user_id').references('id').inTable('users');
        table.datetime('expire_date');
        table.string('session_key', 96);
        
        table.unique('user_id');
        table.unique('session_key');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('sessions');
};
