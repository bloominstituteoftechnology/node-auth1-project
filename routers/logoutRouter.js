const router = require("express").Router();


router.get('/', (req, res) => {
  console.log('alive')
  if (req.session) {
    console.log('session->')
    req.session.destroy(err => {
      if (err) {
        res.send('you stuck bro');
      } else {
        res.send('you made it out! yay!');
      }
    });
  } else {
    res.status(200).json({message: 'you are logged out'});
  }
});



    module.exports = router;
