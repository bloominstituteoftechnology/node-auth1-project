const db = require('../data/dbconfig.js')
module.exports = {
    get,
    add, 
    getById,
    searchBy,

}
function get(){
    return db('users')
}

async function add(newUser){
  try{
    [id] = await db('users').insert(newUser, "id") 
    addedUser = await db('users').getById(id)
    return addedUser
  }
  catch(error){
      console.error(error)
  }
}

function getById(id){
    return db('users').where({ id }).first()
}

async function searchBy(thisData){
    try{
        const finding = get().where(thisData).first()
        return finding
    }
    catch(error){
        console.error(error)
    }
}