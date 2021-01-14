
exports.up = function(knex) {
    return knex.schema
        .createTable('users', table => {
            table.increments('user_id');
            table.text('username', 20)
                .notNullable()
                .unique()
                .index();
            table.text('password')
                .notNullable();
        })
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('users');
};
