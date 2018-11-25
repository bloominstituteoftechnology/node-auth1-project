exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('Users')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('Users').insert([
        { username: 'Carlo1', password: 'Carlo1' },
        { username: 'Carlo2', password: 'Carlo2' },
        { username: 'Carlo3', password: 'Carlo3' }
      ]);
    });
};
