const db = require('../dbConfig.js');

module.exports = {
    get: function (id) {
        let query = db('users as u');

        if (id) {
            return query
                .where('id', id)
                .first();
        }

        return query.select('email', 'user_name');
    },
    insert: function (user) {
        return db('users')
            .insert(user)
            .then(([id]) => this.get(id));
    },
    login: function (user_name) {
        let query = db('users as u');

        return query
            .where('user_name', user_name)
            .first();

    }
};
