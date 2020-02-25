
exports.up = function(knex) {
    return knex.schema
      .createTable('projects', tbl => {
          tbl.increments();
          tbl.string('username', 128)
            .notNullable();
          tbl.string('project', 128)
            .notNullable();
      });
  };
  
  exports.down = function(knex) {
      return knex.schema
      .dropTableIfExists('users');
  };
  