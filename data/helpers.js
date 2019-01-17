//**HELPER FUNCTIONS FOR USERS TABLE */
const db = require('./dbConfig');

module.export = {

    //Add User
    addUser: function(newUser){
        return db('users')
            .insert(newUser)
    },

    //Get User by ID
    getUserById: function(id){
        return db('users')
        .where('users.id', id)
    }
}