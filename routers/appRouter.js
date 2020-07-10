const express = require("express");
const server = express();
const RouterModel = require("./modelRouter")
const bcrypt = require("bcryptjs")
const blockUser = require("../middleware/blockUser");
const modelRouter = require("./modelRouter");
const { json } = require("express");

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

//GET🏄🏽‍♂️ Test your Route
server.get("/api", async (req, res, next) => {
  try {
    res.json({ message: "working" });
  } catch (error) {
    next(error);
  }
});

// GET Test Seed Data & Model ✅
server.get("/api/data", async (req, res, next) => {
  try {
    const data = await RouterModel.findUserById()
    res.status(200).json({ data: data });
  } catch (error) {
    next(error);
  }
});


// Test session ✅
server.get("/users", blockUser(), async (req, res, next) => {
    try {
        res.json(await RouterModel.getUser())
    } catch (error) {
        next(error)
    }
})


// GET BY :id ✅
server.get("/users/:id", async (req, res, next) => {
    try {
        const id = req.params.id
        res.json(await RouterModel.findUserById(id))

    } catch (error) {
        next(error)
    }
})

// Adding New User ✅
server.post('/users', async (req, res, next) => {
    try {
        const {username, password} = req.body
        const user = await RouterModel.findUserBy({username}).first()
    
        if(user) {
            return res.status(409).json({
                message: "Please Select A different User Name"
            })
        }

        const addNewUser = await RouterModel.addUser({
            username,
            password: await bcrypt.hash(password, 10),
        })

        res.status(201).json(addNewUser)

    } catch (error) {
        next(error)
    }
})

// Loggin IN User ✅
server.post("/login", async (req, res, next) => {
    
    try {
        const {username, password} = req.body
        const user = await modelRouter.findUserBy({username}).first()

        if(!user) {
            return res.status(401).json({
                message:"Username or Password is incorrect"
            })
        }

        const passwordChecker = await bcrypt.compare(password, user.password)

        if(!passwordChecker) {
            return res.status(401).json({
                message:"Username or Password is incorrect"
            })
        }

        req.session.user = user

        res.json({
            message:`Welcome ${user.username}, you're logged in. `
        })

    } catch (error) {
        next(error)
    }
})

// Logging out complete ✅
server.get("/logout", async (req, res, next) => {
	try {
		req.session.destroy((err) => {
			if (err) {
				next(err)
			} else {
				res.status(204).end()
			}
		})
	} catch (err) {
		next(err)
	}
})



//export your router
module.exports = server;
