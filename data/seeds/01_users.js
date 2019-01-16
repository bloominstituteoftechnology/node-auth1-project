
exports.seed = function(knex, Promise) {
  return knex('Users').truncate()
    .then(function () {
      return knex('Users').insert([
        {Username: "UserOne", Password: "1234567zyxw"},
        {Username: "RubberDuck", Password: "gurlllllexplaindis"},
        {Username: "StumpyJo", Password: "datcat5678$$$%"},
        {Username: "HollabackGurl", Password: "aintnohollabackgirlbananas"},
      ]);
    });
};
