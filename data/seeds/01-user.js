const bcrypt = require("bcryptjs");
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("users")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert([
        { username: "caleb", password: bcrypt.hashSync("123", 5) },
        { username: "redd", password: bcrypt.hashSync("123", 5) },
        { username: "joni", password: bcrypt.hashSync("123", 5) }
      ]);
    });
};
