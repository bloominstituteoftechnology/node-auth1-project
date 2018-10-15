const db = require('../dbConfig.js');

module.exports = {
	getAllUsers: function() {
		let query = db('users');
		return query;
	},
	getUser: function(username) {
		let query = db('users as u');
		return query
			.select('password')
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
