const users = require('../data/db-config'); 

module.exports = {
    find
}

function find() {
    return users('users'); 
}