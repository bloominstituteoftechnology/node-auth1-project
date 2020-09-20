const bcrypt = require("bcrypt");

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {email: "bob@gmail.com", first_name: "Bob", last_name: "Barker", password: bcrypt.hashSync("thepriceisright", 14)},
        {email: "gordon@chefsanonymous.com", first_name: "Gordon", last_name: "Ramsey", password: bcrypt.hashSync("ITSRAW!", 14)},
      ]);
    });
};
