const db = require('../data/dbConfig');

module.exports = {
    findBy,
    insert,
    get

}


async function findBy(filter){
    return await db('Users').where(filter).orderBy('id')
}

async function insert(user){
    return await db.insert(user).into('Users');
}

async function get(){
    return await db('Users');
}