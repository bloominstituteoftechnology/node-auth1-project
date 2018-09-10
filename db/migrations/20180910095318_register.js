
exports.up = function(knex, Promise) {
  return knex.schema.createTable("register", table => {
    table.increments()
    table.timestamp('generated').defaultTo(knex.fn.now())
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('register');
};
