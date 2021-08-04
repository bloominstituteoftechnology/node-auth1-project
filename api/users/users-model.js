const db = require('../../data/db-config')

function find() {
return db('users').select('user_id', 'username')
}


function findBy(filter) {
return db('users').where(filter)
}


function findById(user_id) {
  return db('users').select('user_id','username').where('user_id', user_id)

}


async function add(user) {
  const [id] = await db('users').insert(user)
    return findById(id)
}


module.exports = { find,
  findById,
  findBy,
  add


}