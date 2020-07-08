
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').truncate()
      .then(async function() {
          // Inserts seed entries
          await knex('users').insert([
              { id: 1, username: 'john', password: 'john123' },
              { id: 2, username: 'jim', password: 'jim123' },
              { id: 3, username: 'jack', password: 'jack123' }
          ]);
      });
};