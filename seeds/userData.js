
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('user_table').del()
    .then(function () {
      // Inserts seed entries
      return knex('user_table').insert([
        {Username: 'vmx12', Password: 'iNeverMetYou' },
        {Username: 'rmx14', Password: 'iLoveCrackers' },
        {Username: 'test13', Password: 'xXxxx12'}
      ]);
    });
};
