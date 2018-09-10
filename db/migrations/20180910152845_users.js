
exports.up = function(knex, Promise) {
  knex.schema.createTable('users',function(tbl){
    users.increments();
    users
        .string('username',128)
        .notNullable()
        .unique();
    users.string('password',128).notNullable()
  })
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('users');
};
