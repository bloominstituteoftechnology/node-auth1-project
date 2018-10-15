
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function(t){
        // assign primary key ID for user, auto-increments
        t.increments();
        // username is string max 255, notNull, and unique
        t.string('username', 255).notNullable().unique();
        // password is string max 255, notNull
        t.string('password', 255).notNullable();
        // timestamp
        t.timestamp('createdAt').defaultTo(knex.fn.now());
    })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
