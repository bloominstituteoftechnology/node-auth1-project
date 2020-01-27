exports.up = function(knex) {
    // don't forget the return statement
    return knex.schema.createTable('user', project => {
      // creates a primary key called id
      project.increments();
      // creates a text field called name which is both required and unique
      project.text('username', 128).unique().notNullable();
      // creates a text field which is required
      project.decimal('password', 255).notNullable();
    });
  };
  
  exports.down = function(knex) {
    // drops the entire table
    return knex.schema.dropTableIfExists('user');
  };