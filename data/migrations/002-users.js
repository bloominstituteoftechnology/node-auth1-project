
exports.up = function(knex) {
  return knex.schema.createTable('users', users => {
      users.increments()

      users.string('username', 128)
            .notNullable()
            .unique();

      users.string('password', 128)
            .notNullable()

      users.integer('role_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('roles')
      .onUpdate("CASCADE")
      .onDelete('RESTRICT')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users')
};
