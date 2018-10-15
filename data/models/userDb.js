const db = require('../dbConfig.js');

module.exports = {
	registerNewUser: function(credentials) {
		let query = db('users');
		return query
			.insert(credentials)
			.then(id => ({ id: id }));
	},
};
