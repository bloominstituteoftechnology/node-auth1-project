const router = require('express').Router();
const Users = require('../users/users-model.js');
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.pssword = hash;

  try {
    const saved = await Users.add(user)
    res.status(201).json(saved)
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

router.post('/login', async (req, res) => {
  let {username, password} = req.body;

  try {
    const user = await Users.findBy({username}).first();
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({message: 'welcome'});
    } else {
      res.status(401).json({message: 'invalid'})
    }
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
});

router.get('/logout', (req, res) => {
  if (req.sessions) {
    req.session.destroy(err => {
      if (err) {
        res.send(`can't log out`)
      } else {
        res.send("See you later!")
      }
    });
  } else {
    res.end();
  }
})

module.exports = router