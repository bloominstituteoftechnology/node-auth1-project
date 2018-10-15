
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { username: "ghobrial.andrew", password: "password" },
        { username: "bob.saget", password: "bob123" },
        { username: "michael.scott", password: "tobysux" },
        { username: "spongebob", password: "krabbypatty" },
      ]);
    });
};
