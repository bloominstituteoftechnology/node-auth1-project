
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', users =>{
             users.increments(),
             users.string('name', 255).notNullable().unique(),
             users.string('password', 255).notNullable()
  })
};

exports.down = function(knex, Promise) {
   return knex.schema.dropTable('users')
};
