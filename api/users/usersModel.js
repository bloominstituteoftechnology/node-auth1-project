const db = require('../../database/pgConfig');


const find = () => {
  return db('accounts')
}

const findBy = (filter) => {
  return db('accounts').where(filter)
}

const findById = (id) => {
  return db('accounts').where({ id }).first()
}

const add = async (payload) => {
  [id] = await db('accounts').insert(payload, 'id')
  return findById(id)
}
module.exports = {
  find,
  findBy,
  findById,
  add,
}