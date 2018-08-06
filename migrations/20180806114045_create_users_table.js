exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('users', function(table) {
      table
        .increments();
      table
        .string('username')
        .notNullable();
      table
        .string('password')
        .notNullable();
      table
        .timestamp('created_at')
        .notNullable()
        .defaultTo(knex.fn.now());
        table
        .timestamp('updated_at')
    }).catch(error => {
      console.log(error);
      reject(error);
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('projects');
};