const express = require('express');
const bodyParser = require('body-parser');
const { checkJwt } = require('./jwtMiddleware');
const app = express();
const jwt = require('jsonwebtoken');
const { readFileSync } = require('fs');
const secretKey = readFileSync('./secret').toString();
const { modelWithSequelize } = require('./UserModel');
const { routerWithUserModel } = require('./UserRoutes');
const Sequelize = require("sequelize")

const port = 3000;

const sequelize = new Sequelize('sqlite:./db');
const UserModel = modelWithSequelize(sequelize);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(checkJwt);

const userRouter = routerWithUserModel(UserModel);

app.get('/testing', (req, res) => {
	debugger;
	res.send(jwt.sign({ test: 'cool', nice: 'string' }, secretKey));
});

app.use(userRouter);

sequelize.sync().then(
	() => {
		app.listen(port, () => {
			console.log(`listening on ${port}`);
		});
	},
	err => {
		console.log('sequelize failed to sync');
		console.error(err);
	}
);
