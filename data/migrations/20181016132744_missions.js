
exports.up = function(knex, Promise) {
  return knex.schema.createTable('missions', function(tbl) {
    tbl.increments();
      
    tbl.integer('level_of_security')
        .notNullable()
        .unique();

    tbl.string('description', 128).notNullable();
    tbl.text('notes', 256);
    tbl.boolean('completed').defaultTo(false);

    tbl.integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('missions');
};
