const router = require('express').Router();
const bcrypt = require('bcryptjs');

const userModel = require('../users/users-model.js');

router.post('/register', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10)
    user.password = hash
  
    userModel.add(user)
      .then(made => {
        res.status(201).json(made);
      })
      .catch(error => {
        res.status(500).json(error);
      });
});
  
router.post('/login', (req, res) => {
    let { username, password } = req.body;
  
    userModel.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          req.session.user = user
          res.status(200).json({ message: `Welcome ${user.username}, thank you for using our services!` });
        } else {
          res.status(401).json({ message: 'Invalid Credentials, Please try again' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
});

router.get('/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            if(err) {
                res.send('You are not logged out');
            } else {
                res.send('You are logged out, thank you come again!');
            }
        })
    } else {
        res.end()
    }
});

module.exports = router;