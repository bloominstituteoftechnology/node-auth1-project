const router = require('express').Router();
const User = require('../User/user');


router
  .post('/', (req, res) => {
    const user = new User(req.body);

   user
       .save()
       .then(user => res.status(200).send(user));
       .catch(err => res.status(500).send(err, console.log(err)));

  });



module.exports = router;
