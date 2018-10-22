
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username:"example user name 1", password: "passwordExample1"},
        {username: "example user name 2", password: "passwordExample2"}
      ]);
    });
};
