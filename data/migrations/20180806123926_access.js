exports.up = function(knex, Promise) {
  return knex.schema.createTable('access', function(t) {
    t.increments(); // PK defaults to 'id'
    t.integer('u_id') // FK to actions
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    t.boolean('loggedIn').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('access');
};
