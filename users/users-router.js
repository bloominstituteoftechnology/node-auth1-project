const router = require("express").Router();

const Users = require("./users-model.js");
const { restrict } = require("../middleware/restrict.js");

router.get("/", restrict(), async (req, res) => {
	try {
		res.json(await Users.find());
	} catch (error) {
		next(error);
	}
});

module.exports = router;
