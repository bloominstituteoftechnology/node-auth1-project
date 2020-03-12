const bcrypt = require('bcryptjs');
const db = require('../database/config');

//find users

function find() {
	return db('users').select('id', 'username');
}

function findBy(filter) {
	return db('users').select('id', 'username', 'password').where(filter);
}
//find user by id
function findById(id) {
	return db('users').select('id', 'username').where('id', id).first();
}
//add new user

async function addUser(user) {
	user.password = await bcrypt.hash(user.password, 14);
	const [ id ] = await db('users').insert(user);
	return findById(id);
}

module.exports = {
	find,
	findById,
	addUser,
	findBy
};
