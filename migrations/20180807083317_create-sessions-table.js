
exports.up = function (knex, Promise) {
  return knex.schema.createTable('sessions', table => {
    table.increments()
    table.string('sid').notNull()
    table.text('sess').notNull()
    table.datetime('expire').notNull()
  })
}

exports.down = function (knex, Promise) {

}
