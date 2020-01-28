const router = require('express').Router();
const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

router.use('/auth', authRouter);
router.use('/users', usersRouter);

router.get("/", (req,res)=>{
    res.json(`Api is working`)
})
router.get("/logout", (req,res)=>{
    if (req.session) {
        req.session.destroy(err => {
          if (err) {
            res.send('error logging out');
          } else {
            res.send('good bye');
          }
        });
      }
})

module.exports = router;
