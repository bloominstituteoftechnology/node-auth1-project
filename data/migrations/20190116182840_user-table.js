
exports.up = function(knex, Promise) {
  knex.schema.createTable('user', user => {
      user.increments();
      user.string('userName', 128)
      .notNullable()
      .unique();
      user.string('password', 128)
      .notNullable();
  })
};

exports.down = function(knex, Promise) {
  knex.schema.dropTableIfExists('user');
};
