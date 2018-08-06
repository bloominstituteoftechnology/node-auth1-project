
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'user1', password: '$2a$14$0/s7FciPuSW.XBtOSG5jUO1iUQwMFWqeboTaPBuFuMFlifI76G0ua', locked:'0'},
        {username: 'user2', password: '$2a$14$QdRO/.mWqUbJV66HciCw3OXIXDKeZH7mcdUBdS9zUaiZNi20bjMi6', locked:'0'},
        {username: 'user3', password: '$2a$14$pMGLWvsDQqM3rll6OX2uE.UgDomGXiFJ8Szz0PyYgr7DQQse6le7u', locked:'0'}
      ]);
    });
};

// username: 'user1', password: 'pass1'
// username: 'user2', password: 'pass2'
// username: 'user2', password: 'pass2'