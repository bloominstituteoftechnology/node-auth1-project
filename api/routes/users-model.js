const db = require('../../config/dbConfig');

module.exports = {
	find,
	findByID,
	addNewUser
};

function find() {
	return db('users');
}

function findByID(id) {
	return db('users').where({ id }).first();
}
function addNewUser(user) {
	return db('users').insert(user, 'id').then(([ id ]) => {
		const addedUser = findByID(id);
		return addedUser;
	});
}
