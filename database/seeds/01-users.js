exports.seed = function (knex) {
	return knex('users').insert([
		{ id: 1, username:'ard2020', password: 'password', },
	])
}