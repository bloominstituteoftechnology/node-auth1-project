const router = require("express").Router();
const bcrypt = require("bcrypt");

const users = require("../users/usersModel.js");

router.post("/register", async (req, res, next) => {
    let user = req.body;

    if(!(user.fname && user.lname && user.username && user.password)) {
        next({ code: 400, message: "Missing required data: First Name, Last Name, Username, and/or Password" });
    } else {
        const hash = bcrypt.hashSync(user.password, 10);
        user.password = hash;
        
        try {
            const saved = await users.add(user);
            req.session.user = saved;
            res.status(201).json(saved);
        } catch (err) {
            console.log(err);
            next({ code: 500, message: "Error Adding User to database" });
        }
    }
});

router.post("/login", async (req, res, next) => {
    let user = req.body;

    if(!(user.username && user.password)) {
        next({ code: 400, message: "Missing username and/or password" });
    } else {
        try {
            const found = await users.findBy({username: user.username});
            
            if(found && bcrypt.compareSync(user.password, found.password)) {
                req.session.user = found;
                res.status(200).json({ message: `Welcome ${found.fname} ${found.lname}`});
            } else {
                next({ code: 401, message: "Username or Password incorrect" });
            }
        } catch (err) {
            next({ code: 500, message: "Error login in" });
        }
    }
})

router.get("/logout", (req, res, next) => {
    if(req.session) {
        req.session.destroy(err => {
            if(err) {
                console.log(err);
                next({ code: 401, message: "There was a problem login out" });
            } else {
                res.send("You have been logged out successfully.");
            }
        });
    } else {
        res.end();
    }
})


module.exports = router;