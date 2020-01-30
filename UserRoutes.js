const { Router } = require('express');
const { hash, genSalt, compare } = require('bcrypt');
const jwt = require('jsonwebtoken');
const { readFileSync } = require('fs');

const secretKey = readFileSync('./secret').toString();
const router = Router();
const saltRounds = 10;

const routerWithUserModel = User => {
	//

	router.post('/sign-up', async (req, res) => {
		const { name, email, password } = req.body;
		// should make sure all inputs are strings
		if (!(name && email && password)) {
			return res.status(422).send({
				err: 'name, email, and password required'
			});
		}

		try {
			const salt = await genSalt(saltRounds);
			const passwordDG = await hash(password, salt);
			await User.create({ name, email, passwordDG });
		} catch (e) {
			return res.status(422).send({
				err: 'name, email, or password taken or invalid'
			});
		}

		const payload = { name, email };
		res.set('Authorization', jwt.sign(payload, secretKey));
		res.json(payload);
	});

	router.post('/sign-in', async (req, res) => {
		const { name, email, password } = req.body;
		// should make sure all inputs are strings
		if (!(name && email && password)) {
			return res.status(422).send({
				err: 'name, email, and password required'
			});
		}

		const foundUser = await User.findOne({ where: { name, email } });
		const passwordsMatch = foundUser
			? await compare(password, foundUser.passwordDG)
			: false;

		if (passwordsMatch) {
			const payload = { name, email };
			res.set('Authorization', jwt.sign(payload, secretKey));
			res.json(payload);
		} else {
			res.status(422).send({
				err: 'name, email, or password invalid'
			});
		}
	});

	router.get('/me', (req, res) => {
		const { user } = req;
		if (user) {
			const payload = { ...user };
			delete payload.iat;
			res.set('Authorization', jwt.sign(payload, secretKey));
			res.json(user);
		} else {
			res.status(401).send({
				err: 'not signed in'
			});
		}
	});

	return router;
};

module.exports = {
	routerWithUserModel
};
