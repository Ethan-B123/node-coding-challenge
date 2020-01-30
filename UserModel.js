const { Model, DataTypes } = require('sequelize');

// name, email, and password
const modelWithSequelize = sequelize => {
	class User extends Model {}
	User.init(
		{
			name: { allowNull: false, type: DataTypes.STRING },
			email: { allowNull: false, type: DataTypes.STRING },
			passwordDG: { allowNull: false, type: DataTypes.STRING }
		},
		{
			sequelize,
			modelName: 'user',
			indexes: [
				{
					unique: true,
					fields: ['name']
				},
				{
					unique: true,
					fields: ['email']
				}
			]
		}
	);
	return User;
};

module.exports = { modelWithSequelize };
