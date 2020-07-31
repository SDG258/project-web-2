const Sequelize = require('sequelize');
const db = require('./db');
const Model = Sequelize.Model;

class Saving extends Model {
    static async findUserByIdCard(idCard){
        return User.findOne({
            where: {
                transactionNumber: idCard
            }
        });
    }
    
    static async findByTransactionNumber(transactionNumber) {
      return Saving.findOne({
        where: {
          transactionNumber: transactionNumber
        }
      });
    }
}

Saving.init({
    transactionCardNumber: { //Số thẻ thực hiện giao dịch
    type: Sequelize.STRING,
    allowNull: false,
  },

  interestRate: { //Số phần trăm lãi suất 
    type: Sequelize.STRING,
    allowNull: false,
  },

  amounOfMoney: { //Số tiền
    type: Sequelize.STRING,
    allowNull: false,
  },

  duration: { //Thời hạn
    type: Sequelize.STRING,
  },

  transactionNumber: { //Số giao dịch
    type: Sequelize.STRING,
  },

  status: { //Tình trạng
    type: Sequelize.STRING,
  },

}, {
  sequelize: db,
  modelName: 'saving',
});

module.exports = Saving;