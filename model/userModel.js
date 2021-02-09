const db = require('../data/dbConfig');

module.exports = {
    findBy
}


async function findBy (filter){
    return db('Users')
}