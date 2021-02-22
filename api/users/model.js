const db = require('../../data/db-config');


const get = () => {
    return  db('Users')
}

const findBy = (filter)=> {
    return  db('Users').where(filter).orderBy('id')
}

const insert = (user) =>{
    return  db.insert(user).into('Users');
}

module.exports = {
    get,
    findBy,
    insert
}
