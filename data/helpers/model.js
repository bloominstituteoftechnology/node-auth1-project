const knex = require('knex');
const bcrypt = require('bcryptjs');

const knexConfig = require('../../knexfile');
const db = knex(knexConfig.development);

module.exports = {
	getUsers,
	addUser,
	login
};

function getUsers() {
	return db('users');
}

function addUser(user) {
	return db('users')
		.insert(user)
		.then(([id]) => id);
}

function login(credentials) {
	return db('users')
		.where({ name: credentials.name })
		.then(([user]) => {
			if (user && bcrypt.compareSync(credentials.password, user.password)) {
				return user;
			} else {
				return undefined;
			}
		});
}
