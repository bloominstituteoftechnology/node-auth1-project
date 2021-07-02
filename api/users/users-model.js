// The database `auth.db3` includes a single `users` table:

// | field    | data type        | metadata                                      |
// | :------- | :--------------- | :-------------------------------------------- |
// | user_id  | unsigned integer | primary key, auto-increments, generated by db |
// | username | string           | required, unique                              |
// | password | string           | required                                      |

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const db = require('./../../data/db-config.js'); //unsure if the path is set correctly

/**
 [x] resolves to an ARRAY with all users, each user having { user_id, username }
 */
async function find() {
  const allUsers = await db 
    .from('users')
    .select('user_id', 'username');

  return allUsers;
}

/**
 [x] resolves to an ARRAY with all users that match the filter condition // Here I'm setting the filter condition as the username
 */
async function findBy(username) {
  const userUserName = await db('users')
    .select('users.username')
        if(username === 'users.username'){
          return userUserName;
        } else {
          next();
        }
  
}

 async function findBy(user_id) { 
   const currentUser = await db("users as us")          //Here we're selecting the user_id and usernames from the users table
       .select('us.user_id', 'us.username')
     let returnedObject = {
       user_id: currentUser[0].user_id,
       username: currentUser[0].username,             //Here we're setting up what our returned object will be
     } 
     if(currentUser[0].user_id){
       returnedObject.users = thisUser.map(user => {     //Then here we're saying to map through the array of users which match the user_id we passed in
         return{
           user_id: users.user_id,
           username: users.username,
           
         }
      })
      
     }

    return returnedObject; 
  }
/**
 [x] resolves to the user { user_id, username } with the given user_id
 */
  async function findById(user_id) { 
    const currentUser = await db("users as us")          //Here we're selecting the user_id and usernames from the users table
        .select('us.user_id', 'us.username')
      let returnedObject = {
        user_id: currentUser[0].user_id,
        username: currentUser[0].username,             //Here we're setting up what our returned object will be
      } 
      if(currentUser[0].user_id){
        returnedObject.users = thisUser.map(user => {     //Then here we're saying to map through the array of users which match the user_id we passed in
          return{
            user_id: users.user_id,
            username: users.username,
            
          }
       })
       
      }
 
     return returnedObject; 
}


/**
 [x] resolves to the newly inserted user { user_id, username }
 */
async function add(user) { 
  const newUser = await db
    .insert({
      user_id: user.user_id,
      username: user.username
    })
    .into("users")
    return newUser;
}

// [x]Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = {
  find,
  findBy,
  findById,
  add
}
