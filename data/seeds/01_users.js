
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'Crash', password: 'UkaUka', registered: true},
        {username: 'Groot', password: 'IamGroot', registered: true},
        {username: 'Napster', password: '123onetwothreeunodostreseinszweidrei', registered:true}
      ]);
    });
};
