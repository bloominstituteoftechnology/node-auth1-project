
exports.up = function(knex, Promise) {
  knex.schema.createTable('users', tbl => {
      tbl.increments(); 
      tbl
        .string('username')
        .notNullable()
        .unique()
      tbl
        .string('password')
        .notNullable();
  }); 
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('users'); 
};
