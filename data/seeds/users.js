exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("users")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert([
        {id: 1, username: "user1", password: "123abc"},
        {id: 2, username: "user2", password: "1234abcd"},
        {id: 3, username: "user3", password: "12345abcde"}
      ]);
    });
};
