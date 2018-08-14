
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', user => {
      user.increments()

      user.string('name')
      .notNullable()
      .unique()

      user.text('bio')
      .notNullable()

      user.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  
};
