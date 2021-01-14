const { increment } = require("../dbConfig");

exports.up = async function(knex) {
    await knex.schema.createTable("users",(table)=>{
        table.increments("id")
        table.text("user_name").notNullable().unique()
        table.text("password").notNullable()
  })
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("users")
};
