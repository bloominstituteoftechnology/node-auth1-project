
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('missions').del()
    .then(function () {
      // Inserts seed entries
      return knex('missions').insert([
        {description: 'Commit', notes: 'Often and Clear', user_id: 10, level_of_security: 2},
        {description: 'Push', notes: 'Up, up and away', user_id: 2, level_of_security: 1},
        {description: 'Coast', notes: 'Lupe Fiasco', user_id: 1, level_of_security: 3}
      ]);
    });
};
