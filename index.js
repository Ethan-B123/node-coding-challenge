const express = require('express');
const bodyParser = require('body-parser');
const { checkJwt } = require('./jwtMiddleware');
const app = express();
const { modelWithSequelize } = require('./UserModel');
const { routerWithUserModel } = require('./UserRoutes');
const Sequelize = require('sequelize');

const port = process.env.PORT || 3000;

const sequelize = new Sequelize('sqlite:./db');
const UserModel = modelWithSequelize(sequelize);

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(checkJwt);

const userRouter = routerWithUserModel(UserModel);
app.use(userRouter);

sequelize.sync().then(
	() => {
		app.listen(port, () => {
			console.log(`
      -----
      listening on ${port}
      navigate to localhost://${port} to test functionality
      -----
      `);
		});
	},
	err => {
		console.log('sequelize failed to sync');
		console.error(err);
	}
);
