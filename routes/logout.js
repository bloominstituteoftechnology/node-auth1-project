const router = require('express').Router();

router
  .get('/', (req, res) => {
    if(req.session){
      req.session.destroy(error => {
        error
          ? res.status(500).json({ error: error })
          : res.status(200).json({
            message: 'Logged out',
            userId: null
          });
      })
    }
  })

module.exports = router;