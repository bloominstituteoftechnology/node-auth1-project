const knex = require('knex')
const knexConfig = require('../../knexfile')
const db = knex(knexConfig.development)
const table = 'userInfo'

module.exports = {
    get,
    getByUsername,
    getAllUsernames,
    add,

}

function get(){
 return db(table)
}

function getByUsername(username){
    return db(table).where({username}).first()
}

function getAllUsernames(){
    return db(table).select('username')
}

function add(newRecord){    
    return db(table).insert(newRecord).into(table)
}



