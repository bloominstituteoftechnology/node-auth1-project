const bcrypt = require('bcrypt');

const BCRYPT_COST = 11;

const hashPassword = async (password) => {
  const hash = await bcrypt.hash(password, BCRYPT_COST);
  return hash;
};

const comparePassword = async (password, hash) => {
  const match = await bcrypt.compare(password, hash);
  return match;
};

module.exports = {
  hashPassword, comparePassword
};
