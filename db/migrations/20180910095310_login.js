
exports.up = function(knex, Promise) {
  return knex.schema.createTable("login", table => {
    table.increments()
    table.timestamp('generated').defaultTo(knex.fn.now())
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('login');
};
