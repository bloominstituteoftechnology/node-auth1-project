exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert([
        { username: "bob", password: "password123" },
        { username: "jeff", password: "password123" },
        { username: "mitch", password: "password123" }
      ]);
    });
};
