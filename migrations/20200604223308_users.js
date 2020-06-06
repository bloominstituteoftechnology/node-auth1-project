
exports.up = function(knex) {
    return knex.schema
    .createTable('users', tbl => {
        tbl.increments('id');
        tbl.string("user_name", 128)
            .unique()
            .notNullable();
        tbl.string("password", 128)
            .notNullable();
    })
  
};

exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists("users")
  
};
