const db = require('../data/db-config')

const add = (user) => {
    return db("usersList").insert(user, "id")
        .then(ids => {
            const [id] = ids;
            return findById(id);
        })
}

const findById = id => {
    return db("usersList").where({id}).first();
}

const findBy = filter => {
    return db("usersList").where(filter);
}

const retrieve = () => {
    return db("usersList");
}

module.exports = {
    add,
    findById, 
    findBy,
    retrieve
}