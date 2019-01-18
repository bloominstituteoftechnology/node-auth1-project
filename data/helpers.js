//**HELPER FUNCTIONS FOR USERS TABLE */
const db = require('./dbConfig');

module.exports = {

    //Add User
    addUser: function(newUser){
        return db('users')
            .insert(newUser)
    },

    //Get User by name
    getUserByName: function(userName){
        return db('users')
        .where('users.username', userName)
        .first()
    },

    //Get all users
    getUsers: function(){
        return db('users')
    }
}