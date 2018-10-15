
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { username: 'Evan', password: 'p4ssw0rd' },
        { username: 'testuser1', password: 'birthday' },
        { username: 'testuser2', password: 'maidenname' }
      ]);
    });
};
