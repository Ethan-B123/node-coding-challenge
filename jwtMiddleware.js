const jwt = require('jsonwebtoken');
const { readFileSync } = require('fs');
const secretKey = readFileSync('./secret').toString();

const checkJwt = async (req, res, next) => {
	const jwtString = req.get('Authorization');

	jwt.verify(jwtString, secretKey, (err, jwtData) => {
		if (err) {
			req.jwtData = false;
		} else {
			const newJwt = JSON.parse(JSON.stringify(jwtData));
			delete newJwt.iat;
			res.set('Authorization', jwt.sign(newJwt, secretKey));
			req.jwtData = jwtData;
		}
		next();
	});
};

module.exports = {
	checkJwt
};
