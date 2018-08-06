
exports.up = function (knex, Promise) {
  return knex.schema
    .createTable('users', table => {
      table.increments()
      table.string('username').notNull().unique()
      table.string('hashPassword').notNull()
    })
}

exports.down = function (knex, Promise) {
  return knex.schema
    .dropTableIfExists('users')
}
