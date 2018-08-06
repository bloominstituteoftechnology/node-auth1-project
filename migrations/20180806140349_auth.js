
exports.up = function(knex, Promise) {
  return knex.schema.createTable('project', tbl => {
      tbl.increments('id');

      tbl.string('name', 256)
      .notNullable()
      .unique()
      .defaultTo('Enter Username');

      tbl.string('password', 256)
      .notNullable()
      .unique()
      .defaultTo('Enter Password');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('project')
};
