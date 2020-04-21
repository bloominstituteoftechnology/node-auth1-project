
exports.up = function(knex) {
  return knex.schema
          .createTable('users', (tbl) => {
            tbl.increments('id')
            tbl.string('username', 30).notNullable().unique()
            tbl.string('password', 255).notNullable()
          })
};

exports.down = function(knex) {
  return (
    knex.schema
      .dropTableIfExists('users')
  )
};
