
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('accounts').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('accounts').insert([
        {user_name: 'Frodo', password:"chozen1"},
        {user_name: 'Sam', password:"1/2wise"},
        {user_name: 'Pippin', password:"fool0Took"}
      ]);
    });
};
