const db = require('./dbConfig');
const bcrypt = require('bcryptjs');

module.exports = {
  login,
  register,
  userExists,
  find
};

async function find(username, token, id=0)
{
  /* if(!username || !token) throw "unauthorized access to database, please login"
  let user = await db('users')
  .where({ username }).first();
  if(createToken(user) !== token ) throw "unauthorized access to database, please login" */
  if(id > 0) return db('users')
  .where({id}).first();
  return db('users');
}

async function login(username, password) 
{
  let user = await db('users')
  .where({ username }).first();
  if(user.authentication === (bcrypt.hashSync(password,14)))
    return createtoken(user);
  return success;
}

function createToken(user)
{
  return bcrypt.hashSync(user.authentication+user.username+user.id, 8);
}

async function userExists(username)
{
  let flag = await db('users')
  .where("username", username);
  if(flag.length > 0 ) throw "this username already exists"
}

async function register(username, password)
{
  let passwordhash = bcrypt.hashSync(password,14);
  let user = await db("users")
  .insert({username: username, authentication: passwordhash});
  let token = createToken(user);
  console.log(user);
  return {username: user.username, token: token};
}
