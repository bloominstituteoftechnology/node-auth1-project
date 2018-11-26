exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("users")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert([
        {username: "user1", password: "123abc"},
        {username: "user2", password: "1234abcd"},
        {username: "user3", password: "12345abcde"}
      ]);
    });
};
