const express = require('express'); 

const db = require('./usersModel'); 

const router = express.Router(); 

//* 🎆 Get all users 🎆 *// 
//TODO 🧵 a piece of middleware validating the username and password will need to be created and added to this end point! // 
router.get("/", (req, res) => {
    db.find()
        .then(items => {
            res.status(200).json(items);
        })
        .catch(error => {
            res.status(500).json({ message: "Error finding users" });
        });
}); 


//* router export *// 
module.exports = router; 