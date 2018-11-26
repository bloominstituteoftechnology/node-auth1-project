
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { id: 1, username: 'testUsername', password: '$2a$14$cjImUCi9jj34J5TCBP.ku.5zHF32ngnOk5U8775eyrMr119HQ7Trm' }
      ]);
    });
};
