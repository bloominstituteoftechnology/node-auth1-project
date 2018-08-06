
exports.up = function(knex, Promise) {
  return knex.schema.createTable('register', tbl => {
      tbl.increments();
      tbl.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('register');
};
