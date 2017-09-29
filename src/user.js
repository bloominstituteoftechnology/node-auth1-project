/* eslint func-names: 0 */
const mongoose = require('mongoose');
const { hashPass } = require('./handlers');

mongoose.models = {};
mongoose.modelSchemas = {};

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
});

UserSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('passwordHash')) return next();
  user.passwordHash = await hashPass(user.passwordHash);
  next();
});

module.exports = mongoose.model('User', UserSchema);
