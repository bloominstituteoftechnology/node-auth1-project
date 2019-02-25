// Local imports
const db = require('../dbConfig');

// Gets the list of users in the database.
const getList = _ => {
    return db('users').select('username');
};

// Module exports
module.exports = {
    getList
};
