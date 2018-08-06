
exports.up = function(knex, Promise) {
  return knex.schema.createTable('login', tbl => {
    tbl.increments();
    tbl.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('login');
};
