const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize');
const db = require('./db');
const Model = Sequelize.Model;

class User extends Model {

    static async updateStatus(id,status){
      return User.update({
        activate: status,
      },{
        where: {
          id: id,
        }
      });
    }

    static async findUserById(id){
        return User.findByPk(id);
    }

    static async findUserByEmail(email){
        return User.findOne({
            where: {
                email: email.trim(),
            }
        });
    }

    static async findUserByIdCard(idcard){
      return User.findOne({
          where: {
            idcard: idcard.trim(),
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

  phone: {
    type: Sequelize.STRING,
  },

  dob: {
    type: Sequelize.STRING,
  },

  address: {
    type: Sequelize.STRING,
  },

  wards: {
    type: Sequelize.STRING,
  },

  district: {
    type: Sequelize.STRING,
  },

  city: {
    type: Sequelize.STRING,
  },

  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  token: {
    type: Sequelize.STRING, 
  },

  sms: {
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

  limit: {
    type: Sequelize.STRING, 
  },

  activate: {
    type: Sequelize.STRING, 
  },

  permission: {
    type: Sequelize.STRING, 
  },
}, {
  sequelize: db,
  modelName: 'user',
});

module.exports = User;