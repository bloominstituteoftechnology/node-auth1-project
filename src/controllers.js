const mongoose = require('mongoose');
const { comparePass, sendError } = require('./handlers');

const User = mongoose.model('User');

exports.newUser = async (req, res) => {
  const { username, passwordHash } = req.body;
  const newUser = await new User({ username, passwordHash });
  await newUser.save();
  res.status(200).json(newUser);
};

exports.login = async (req, res) => {
  const { username, passwordHash } = req.body;
  const user = await User.findOne({ username });
  if (!user) return sendError(422, 'Please enter a valid username and password', res);
  const compared = await comparePass(passwordHash, user.passwordHash);
  req.session.user = user.id;
  return compared
    ? res.json({ Success: true })
    : sendError(422, 'Please enter a valid username and password', res);
};

exports.getMe = (req, res) => {
  res.json(req.user);
};

exports.restricted = (req, res) => {
  res.json(req.user);
};
