const db = require('../data/dbConfig');

module.exports = {
    findBy,
    insert
}


async function findBy(filter){
    console.log(filter)
    return await db('Users')
    .select('id','Username', 'Password')
    .where(filter)
}

async function insert(user){
    return await db.insert(user).into('Users')
}