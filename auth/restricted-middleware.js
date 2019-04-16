module.exports = (req, res, next) => {
    if (req.session && req.session.user) {
      next();
    } else {
      res.status(401).json({ message: 'You cannot pass beyond this point!' });
    }
  };


  // function restricted(req, res, next) {
  //   const { username, password } = req.headers;
  
  //   if (username && password) {
  //     userModel.findBy({ username })
  //     .first()
  //     .then(owner => {
  //       if (owner && bcrypt.compareSync(password, owner.password)) {
  //         next()
  //       } else {
  //         res.status(401).json({ message: 'Invalid Credentials' })
  //       }
  //     })
  //     .catch(error => {
  //       res.status(500).json({ message: 'ERROR'})
  //     })
  //   } else {
  //     res.status(400).json({ message: 'No Credentials Provided'})
  //   }
  // }