const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const cryptoRandomString = require('crypto-random-string');
const CronJob = require('cron').CronJob;

const Deal = require('../services/deal');
const User = require('../services/user');
const upload = require('../middlewares/upload');
const router = new Router();

var err = null;

// const job = new CronJob('0 */1 * * * *',function() { //Chạy sau mỗi 24h
//     User.sync().then(async function() {
//         const userSend = await User.findUserByIdCard(req.currentUser.idcard);
//         userSend.limit = 10000000;
//         userSend.save();
//         console.log("Song Du");
//     })
// })
// job.start();

router.get('/', async function profile(req, res) {
    const deal =  await Deal.findAll({
        where: {
            transactionCardNumber: req.currentUser.idcard,
        },
        order: [['createdAt', 'DESC']]
    });


    if(req.currentUser) {
        res.render('accounts', { deal, err: null });
    } else {
        res.redirect('/')
    }
});

router.post('/transfer', asyncHandler(async function(req, res) {
    if(req.body.amounOfMoney.length == 0 )
    {
        err = "Bạn phải nhập số tiền"
        const deal =  await Deal.findAll({
            where: {
                transactionCardNumber: req.currentUser.idcard,
            },
            order: [['createdAt', 'DESC']]
        });
        return res.render('accounts', { deal, err });
    }
    if(req.body.beneficiaryCardNumber.length == 0) {
        err = "Bạn phải nhập số thẻ"
        const deal =  await Deal.findAll({
            where: {
                transactionCardNumber: req.currentUser.idcard,
            },
            order: [['createdAt', 'DESC']]
        });
        return res.render('accounts', { deal, err });
    }
    const userReceive = await User.findUserByIdCard(req.body.beneficiaryCardNumber);
    if(!userReceive) {
        err = "Không tìm thấy số thẻ"
        const deal =  await Deal.findAll({
            where: {
                transactionCardNumber: req.currentUser.idcard,
            },
            order: [['createdAt', 'DESC']]
        });
        return res.render('accounts', { deal, err });
    }
    const userSend = await User.findUserByIdCard(req.currentUser.idcard);
    if(userSend.limit == 0) {
        err = "Không thể chuyển tiền vược quá hạn mức"
        const deal =  await Deal.findAll({
            where: {
                transactionCardNumber: req.currentUser.idcard,
            },
            order: [['createdAt', 'DESC']]
        });
        return res.render('accounts', { deal, err });
    }
    if(Number(userSend.totalMoney) >= Number(req.body.amounOfMoney)) {
        if(userReceive) {
            userReceive.totalMoney = Number(userReceive.totalMoney) + Number(req.body.amounOfMoney);
            userReceive.save();
            userSend.totalMoney = Number(userSend.totalMoney) - Number(req.body.amounOfMoney);
            userSend.limit = Number(userSend.limit) - Number(req.body.amounOfMoney);
            userSend.save();
            const deal = await Deal.create({
                transactionCardNumber: userSend.idcard,
                beneficiaryCardNumber: req.body.beneficiaryCardNumber,
                tradingName: req.body.tradingName,
                amounOfMoney: req.body.amounOfMoney,
                transactionNumber: cryptoRandomString({length: 5, type: 'numeric'}),
            }).then(function(user) {
                console.log('success', user.toJSON());
            })
            .catch(function(err) {
                console.log(err);
            });
        }
    } else {
        err = "Số tiền trong tài khoản phải lớn hơn số tiền gửi"
        const deal =  await Deal.findAll({
            where: {
                transactionCardNumber: req.currentUser.idcard,
            },
            order: [['createdAt', 'DESC']]
        });
        return res.render('accounts', { deal, err });
    }
    res.redirect('/accounts');
}));

module.exports = router;