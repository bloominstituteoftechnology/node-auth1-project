
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'nucked',
      password: 'godtierekko'
    },
        {username: 'dtrain',
      password: 'tilted'
    },
        {username: 'kataniss',
      password:'illjustfill'
    }
      ]);
    });
};
