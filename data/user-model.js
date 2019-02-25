const knex = require('knex')
const knexConfig = require('../knexfile.js')
const db = knex(knexConfig.development);

module.exports = {
    add,
    get,
    getById,
    findBy,
    remove,
    modify
}

function add(request) {
    return db("users").insert(request)
}

function get() {
    return db("users")
}

function findBy(filter) {
    return db('users').where(filter);
  }

function getById(id) {
    return db("users").where({ id: id })
}

function remove(id) {
    return db("users").where({ id: id }).del()
}

async function modify(id, request) {
    const conditional = await db("users").where('id', Number(id)).update(request)
    if (conditional) {
    return getById(id)}
    else {return null}}