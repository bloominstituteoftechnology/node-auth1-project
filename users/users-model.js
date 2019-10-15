const db = require('../data/db-config')

module.exports = {
    find,
    add,
    findBy,
    findByIb
}


function find() {
    return db('users')
    .select(
        'id',
        'username',
        'password'
    )
};

function add(user) {
    return db('users')
    .insert(user, 'id')
    .then(ids => {
        const [id] = ids
        return findById(id)
    })
}

function findBy(filter) {
    return db('users')
    .where(filter)
}

function findById(id) {
    return db( 'users ')
    .where({ id })
    .first();
}