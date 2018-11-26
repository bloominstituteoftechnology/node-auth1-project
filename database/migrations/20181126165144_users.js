exports.up = knex =>
  knex.schema.createTable('users', users => {
    users.increments()

    users
      .string('username', 128)
      .notNullable()
      .unique()
    users.string('password', 128).notNullable()
  })

exports.down = (knex, Promise) => knex.schema.dropTableIfExists('users')
