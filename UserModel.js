const { Model, DataTypes } = require('sequelize');

// name, email, and password
const modelWithSequelize = sequelize => {
	class User extends Model {}
	User.init(
		{
			name: DataTypes.STRING,
			email: DataTypes.STRING,
			passwordDG: DataTypes.STRING
		},
		{ sequelize, modelName: 'user' }
	);
	return User;
};

module.exports = { modelWithSequelize };
