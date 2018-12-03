const db = require('./dbConfig');
module.exports = {
    getByUsername: function(username) {
        return db('users')
            .where({ username: username })
            .first();
    }
};