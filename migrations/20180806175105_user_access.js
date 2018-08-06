
exports.up = function(knex, Promise) {
    return knex.schema.createTable('access', tbl => {
        tbl.increments();
        tbl.integer('user_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        tbl.boolean('loggedIn').notNullable();
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('access');
};
