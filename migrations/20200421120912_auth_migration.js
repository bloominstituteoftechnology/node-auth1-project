exports.up = function(knex) {
  return knex.schema
    .createTable('users', users =>{
        users.increments('id');
        users.string('username')
          .notNullable()
          .unique();
        users.string('password')
          .notNullable();
    })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users')
};
