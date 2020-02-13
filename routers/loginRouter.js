const router = require("express").Router();

const authMiddle = require("../middleware/auth-req-middleware");


router.post('/', authMiddle, (req, res) => {
    let {username} = req.headers;
    res.status(200).json({message: `welcome back ${username} your login api is working go to the register router and create a new user for a friend`})
})

module.exports = router;
