const express = require('express');
const bcrypt = require('bcryptjs');

const Users = require('./user-model');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send('<h1>Hello world</h1>');
})

router.post('/register', validateUserBody, (req, res, next) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 11);
  Users.add({ username, password: hashedPassword }).then(user => {
    res.status(201).json(user);
  }).catch(next);
});

router.post('/login', validateUserBody, (req, res, next) => {
  const { username, password } = req.body;
  Users.getUser({ username }).then(user => {
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if(!user || !isValidPassword) {
      next({ message: "Invalid credentials", status: 401 });
    }
    res.status(200).json({ id: user.id, username: user.username });
  }).catch(next);
});

router.get('/users', (req, res, next) => {
  Users.getUsers().then(users => {
    if (users) {
      res.status(200).json(users);
    } else {
      next({ message: "No users were found", status: 404 });
    }
  }).catch(next);
});

router.get('/users/:id', validateUserId, (req, res, next) => {
  res.status(200).json(req.user);
});

router.put('/users/:id', validateUserId, validateUserBody, (req, res, next) => {
  Users.update(req.body, req.user.id).then(updatedScheme => {
    res.status(200).json(updatedScheme);
  }).catch(next);
});

router.delete('/users/:id', validateUserId, (req, res, next) => {
  Users.remove(req.user.id).then(deleted => {
    res.status(204).json(req.user);
  }).catch(next);
});

function validateUserId(req, res, next) {
  const { id } = req.params;
  let validId = Number(id);
  if (!Number.isInteger(validId) && validId > 0) {
    next({ message: 'Invalid user id' })
  }
  Users.getUser({ id: validId }).then(user => {
    if (user) {
      req.user = user;
      next();
    } else {
      next({ message: 'Could not find user with given id', status: 404 });
    }
  }).catch(next);
}

function validateUserBody(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    next({ message: 'Missing required `username` and `password` fields', status: 401 });
  }
  req.body = { username, password };
  next();
}

router.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    file: 'user-router',
    method: req.method,
    url: req.url,
    status: error.status || 500,
    message: error.message
  });
})

module.exports = router;