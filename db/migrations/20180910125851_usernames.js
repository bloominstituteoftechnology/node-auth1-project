
exports.up = function(knex, Promise) {
   return knex.schema.createTable('usernames', function(tbl) {
      tbl.increments();
      tbl.string('username')
         .notNullable()
         .unique('username');
      tbl.string('password')
         .notNullable()
   })
};

exports.down = function(knex, Promise) {
   return knex.schema.dropTable('usernames');
};
