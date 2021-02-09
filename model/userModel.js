const db = require('../data/dbConfig');

module.exports = {
    findByUsername,
    insert,

}


async function findByUsername(filter){
    console.log(filter)
    return await db('Users')
    .select('id','Username', 'Password')
    .where(filter)
}

async function insert(user){
    return await db.insert(user).into('Users')
}