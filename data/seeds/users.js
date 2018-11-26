const bcrypt = require("bcrypt");

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("users")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert([
        {id: 1, username: "user1", password: bcrypt.hashSync("123abc", 8)},
        {id: 2, username: "user2", password: bcrypt.hashSync("1234abcd", 8)},
        {id: 3, username: "user3", password: bcrypt.hashSync("12345abcde", 8)}
      ]);
    });
};
