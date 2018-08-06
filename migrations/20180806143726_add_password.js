
exports.up = function(knex, Promise) {
    return knex.schema.table('users', tbl => {
        tbl.string('password')
    })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', tbl => {
      tbl.dropColumn('password')
  })
};
