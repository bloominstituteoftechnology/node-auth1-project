const bcrypt = require('bcrypt');

const SALT_STRENGTH = 10;

const hashPassword = async (password) => {
  console.log('Salt', SALT_STRENGTH);
  console.log('Password', password);
  const hash = await bcrypt.hash(password, SALT_STRENGTH);
  return hash;
};

const comparePassword = async (password, hash) => {
  const match = await bcrypt.compare(password, hash);
  return match;
};

module.exports = {
  hashPassword, comparePassword
};
