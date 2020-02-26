
exports.up = function(knex) {
  return knex.schema.createTable('users',tbl=>{
      tbl.increments();

      tbl
      .string('username',256)
      .notNullable()
      .index()
      .unique()
       
      
      tbl
      .string('password',256)
      .notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("users");
};
