
exports.up = function(knex, Promise) {
    knex.schema.createTable('users', function(tbl) {
        users.increments();
        users
            .string('username', 128)
            .unique()
            .notNullable();
        users.string('password', 128).notNullable()
  })
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('users');
};
