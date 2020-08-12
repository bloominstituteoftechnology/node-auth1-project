const router = require("express").Router();
const Users = require("../api/users/usersModel");
const bcrypt = require('bcrypt');

const { validateUser } = require("../api/users/usersMiddleware");

// POST -> REGISTER NEW USER
router.post("/register", validateUser, (req, res) => {
	let user = req.body;
	const hash = bcrypt.hashSync(user.password, 8);

	user.password = hash;

	Users.add(user)
		.then(newUser => {
            //Once you register it will forward user to their route
            //saves the username info
            req.session.username = newUser.username;
			res.status(201).json({ newUser });
		})
		.catch(error => {
		res.status(500).json({ error: "Problem with the database", error });
	});
});

// POST -> LOGIN With existing User
router.post("/login", validateUser, (req, res) => {
	const { username, password } = req.body;

    Users.findBy({ username })
        .first()
		.then(user => {
			if (user && bcrypt.compareSync(password, user.password)) {
                //good: adds properties to existing session object
				req.session.user = user.username; 
				res.status(200).json({ message: `Welcome ${user.username}!` });
			} else {
				res.status(401).json({ message: "Invalid credentials" });
			}
		})
		.catch(error =>
		res.status(500).json({ error: "Problem with the database", error })
	);
});


// GET -> Removes the cookies from the session

router.get("/logout", (req, res) => {
	req.session.destroy(error => {
		error
			? res.json({ error: "Unable to logout", error })
			: res.send("Logged out");
	});
});

module.exports = router;