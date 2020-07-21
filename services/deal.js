const Sequelize = require('sequelize');
const db = require('./db');
const Model = Sequelize.Model;

class Deal extends Model {
    static async findUserByTransactionNumber(transactionNumber){
        return User.findOne({
            where: {
                transactionNumber,
            }
        });
    }
}

Deal.init({
    transactionCardNumber: { //Số thẻ thực hiện giao dịch
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },

  beneficiaryCardNumber: { // Số thẻ thụ hưởng 
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },

  tradingName: { //Tên giao dịch
    type: Sequelize.STRING,
  },

  amounOfMoney: { //Số tiền
    type: Sequelize.STRING,
    allowNull: false,
  },
  transactionNumber: { //Số giao dịch
    type: Sequelize.STRING,
  },
}, {
  sequelize: db,
  modelName: 'deal',
});

module.exports = Deal;