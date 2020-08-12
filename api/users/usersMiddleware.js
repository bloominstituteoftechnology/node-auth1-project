

const validateId = (db, tableName) => (req, res, next) => {
	const { id } = req.params;

	db(`${tableName}`)
		.where({ id })
		.first()
		.then(response => {
			response
				? (req.response = response)
				: res.status(400).json({ message: "Invalid Id" });
			next();
		})
		.catch(error =>
		res.status(500).json({ message: "Could not validate", error })
	);
};

const validateUser = (req, res, next) => {
	const { body } = req;

	JSON.stringify(body) === "{}"
		? res.status(400).json({ message: "missing user data" })
		: !body.username || !body.password
		? res.status(400).json({
				message: `missing required ${
					!body.username ? "username" : !body.password ? "password" : null
				} field`
		  })
		: (req.response = body);
	next();
};

module.exports = {
	validateId,
	validateUser
};