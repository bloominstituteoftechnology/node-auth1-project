exports.up = function(knex, Promise) {
  return knex.schema.createTable(`users`, table => {
    table.increments(`id`).primary();
    table
      .string(`username`)
      .unique()
      .notNullable();
    table.string(`password`).notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable(`users`);
};
