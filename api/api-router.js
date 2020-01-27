const router = require('express').Router();

router.get("/", (req,res)=>{
    res.json(`Api is working`)
})

module.exports = router;
