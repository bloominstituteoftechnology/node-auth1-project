const bcrypt = require("bcryptjs");

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("users")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert([
        { username: "ruwaidah", password: bcrypt.hashSync("ruwaidah", 12) },
        { username: "rawan", password: bcrypt.hashSync("rawan", 12) },
        { username: "mustafa", password: bcrypt.hashSync("123", 12) }
      ]);
    });
};
