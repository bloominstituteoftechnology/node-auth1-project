
exports.up = function(knex, Promise) {
    return knex.schema
    .createTable("users", column => {
      column.increments();
      column.string("username", 32).notNullable();
      column.string("password", 32).notNullable();
    })
};

exports.down = function(knex, Promise) {
    return knex.schema
    .dropTableIfExists("users")
};
