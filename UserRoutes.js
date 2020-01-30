const { Router } = require('express');
const { hash, genSalt } = require('bcrypt');
const jwt = require('jsonwebtoken');
const { readFileSync } = require('fs');

const secretKey = readFileSync('./secret').toString();
const router = Router();
const saltRounds = 10;

const routerWithUserModel = User => {
	//

	router.post('/sign-up', async (req, res) => {
		const { username, email, password } = req.body;
		// should make sure all inputs are strings
		if (!(username && email && password)) {
			return res.status(422).send({
				err: 'username, email, and password required'
			});
		}
		const salt = await genSalt(saltRounds);
		const passwordDG = await hash(password, salt);
		await User.create({ username, email, passwordDG });

		const payload = { username, email };
		res.set('Authorization', jwt.sign(payload, secretKey));
		res.json(payload);
	});

	router.post('/sign-in', (req, res) => {});

	router.get('/me', (req, res) => {});

	return router;
};

module.exports = {
	routerWithUserModel
};
