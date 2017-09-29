const mongoose = require('mongoose');
const { comparePass, sendError } = require('./handlers');

const User = mongoose.model('User');

exports.newUser = async (req, res) => {
  const { username, passwordHash } = req.body;
  const newUser = new User({ username, passwordHash });
  await newUser.save();
  req.session.user = newUser.id;
  res.status(201).json(newUser);
};

exports.login = async (req, res) => {
  const { username, passwordHash } = req.body;
  const user = await User.findOne({ username });
  if (!user) return sendError(422, 'Please enter a valid username and password', res);
  const compared = await comparePass(passwordHash, user.passwordHash);
  if (!compared) return sendError(422, 'Please enter a valid username and password', res);
  req.session.user = user.id;
  res.status(200).json({ Success: true });
};

exports.getMe = (req, res) => {
  res.json(req.user);
};

exports.restricted = (req, res) => {
  res.json(req.user);
};
