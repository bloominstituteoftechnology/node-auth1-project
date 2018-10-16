const db = require('../dbConfig.js');

module.exports = {
	getAllUsers: function() {
		let query = db('users');
		return query
			.select('id', 'username');
	},
	getUser: function(username) {
		let query = db('users as u');
		return query
			.first()
			.where({ username: username });
	},
	registerNewUser: function(credentials) {
		let query = db('users');
		return query
			.insert(credentials)
			.then(id => ({ id: id }));
	},
};
