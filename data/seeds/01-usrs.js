
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('usrs').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('usrs').insert([
        {usrs_nme: 'Armazi Robertsen', usrs_pwd: '123' },
        {usrs_nme: 'Quintino Baasch', usrs_pwd: '456' },
        {usrs_nme: 'Thoth Thacker', usrs_pwd: '789' }
      ]);
    });
};
