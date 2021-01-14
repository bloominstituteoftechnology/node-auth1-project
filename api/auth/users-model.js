const db = require('../../data/dbConfig');

function get() {
    return db('users')
        .select('user_id', 'username');
}

function findById(id) {
    return db('users').where('user_id', id).first();
}

function findByUsername(username) {
    return db('users').where('username', username).first();
}

async function add(userData) {
    const [ newUserId ] = await db('users').insert(userData);
    console.log(newUserId);

    if (!newUserId) {
        return Promise.resolve(null);
    }

    const newUser = await findById(newUserId);

    return Promise.resolve(newUser);
}

module.exports = {
    get,
    findById,
    findByUsername,
    add
}