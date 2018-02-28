/* eslint-disable */
server.post('/signup', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  bcrypt.hash(password, 10).then((data) => {
    const user = new User({ username, password: data });
    console.log()
    user.save().then( err => {
      res.sendStatus(200);
    })
  });
});

server.put('/login', (req, res) => {

  console.log(req.session);
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({username}, (err, user) => {
    if (err) sendUserError(STATUS_USER_ERROR)


  bcrypt.compare(password, user.password)
    .then( (isMatched, err) => {
      if (isMatched) {
        res.status(200).json({ loggedIn: true })
      } else {
        res.status(500).json({ loggedIn: false })
      }
    })
  })
})

server.get('/isLoggedIn', (req, res) => {

})

/*
// encrypting the password BEFORE we save it to the db
// global middleware on USERSCHEMA ONLY

UserSchema.pre('save', function(next){
  console.log('before save', this.passwordHash)
  bcrypt.hash(this.passwordHash, 10)
    .then((hashed) => {
      this.passwordHash = hashed
      next();
    })
})

UserSchema.methods
UserSchema.methods.checkPassword = function(plainTextPass, cb) {
  bcrypt.compare(plainTextPass, this.password, (err, isMatch) => {
    if (err) return cb(err)
    cb(null, isMatch);
  })
}

// sessions
console.log(req.session)

*/