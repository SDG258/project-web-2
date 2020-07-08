const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize');
const db = require('./db');
const Model = Sequelize.Model;

class User extends Model {
    static async findUserById(id){
        return User.findByPk(id);
    }

    static async findUserByEmail(email){
        return User.findOne({
            where: {
                email,
            }
        });
    }

    static hashPassword(password){
        return bcrypt.hashSync(password, 10);
    }

    static verifyPassword(password, passwordHash){
        return bcrypt.compareSync(password, passwordHash);
    }
}

User.init({
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  displayName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  token: {
    type: Sequelize.STRING, 
  },
  identityCard: {
    type: Sequelize.STRING,
  },
  idcard: {
    type: Sequelize.STRING, 
  },
  totalMoney: {
    type: Sequelize.STRING, 
  },
}, {
  sequelize: db,
  modelName: 'user',
});

module.exports = User;