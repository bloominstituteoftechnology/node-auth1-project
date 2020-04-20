const bcrypt = require('bcrypt');
const rounds = process.env.HASH_ROUNDS || 10
const hash = bcrypt.hashSync('password', rounds)
const userpass = hash

exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex('accounts')
		.del()
		.then(function () {
			// Inserts seed entries
			return knex('accounts').insert([
				{
          username: 'Timmy',
          password: userpass
        },
			]);
		});
};
