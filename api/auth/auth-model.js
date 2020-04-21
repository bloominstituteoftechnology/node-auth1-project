const db = require('../../data/db-config.js')


module.exports = {
  getUsers,
  getByUsername,
  addUser
}

function getUsers(){
  return db('users')
}

function getByUsername(username){
  return db('users')
          .where('username', username)
          .first()
}

function getByID(id){
  return db('users')
          .where({ id })
          .first()
}


function addUser(user){
  return db('users')
          .insert(user)
          .then(([id]) => {
            console.log(id)
            return getByID(id)
          })
}

