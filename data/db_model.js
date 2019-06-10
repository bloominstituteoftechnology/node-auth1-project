const db = require('./dbConfig');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

module.exports = {
  login,
  register,
  userExists,
  find
};

async function find(username, token, id=0)
{
  if(!username || !token) throw "unauthorized access to database, please login"
  let user = await db('users')
  .where({ username }).first();
  if(token !== user.authentication) throw "unauthorized access to database, please login"
  if(id > 0) return db('users')
  .where({id}).first();
  return db('users');
}

async function login(username, password) 
{
  let user = await db('users')
  .where("username", username).first();
  //console.log(bcrypt.hashSync(password,salt) + "        :        ", user.authentication);
  if(bcrypt.compareSync(password, user.authentication)) return {token: user.authentication}
  throw "username and password do not match";
}

function createToken(user)
{
  return bcrypt.hashSync(`${user.authentication}|${user.username}|${user.id}`, 8);
}

async function userExists(username)
{
  if(!username) throw "username must be defined"
  let flag = await db('users')
  .where("username", username);
  if(flag.length > 0 ) throw "this username already exists"
}

async function register(username, password)
{
  let passwordhash = bcrypt.hashSync(password,salt);
  await db("users")
  .insert({username: username, authentication: passwordhash});
  return {token: passwordhash};
}
