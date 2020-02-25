const bcrypt = require("bcryptjs");

exports.seed = function(knex) {
  return knex("users").insert([
    {
      username: "pepper",
      password: bcrypt.hashSync("peperoni", 8)
    },
    {
      username: "yoshi",
      password: bcrypt.hashSync("play", 8)
    },
    {
      username: "rex",
      password: bcrypt.hashSync("eat", 8)
    }
  ]);
};
