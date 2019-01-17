const knex = require('knex');
const dbConfig = require('../knexfile');
const dbOne = knex(dbConfig.development);

function add(user){
    return dbOne('Users').insert(user)
}

function find(id){
    return dbOne('Users').where('Username', id)
}

function fetch(){
    return dbOne('Users')
        .then(response => {
            const mapped = response.map( x => {
                return x.Username
            })
            return mapped
        })
}

module.exports = {
    add, find, fetch
};