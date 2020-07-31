const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const cryptoRandomString = require('crypto-random-string');

const Deal = require('../services/deal');
const User = require('../services/user');
const upload = require('../middlewares/upload');
const router = new Router();

router.get('/', async function profile(req, res) {
    const deal =  await Deal.findAll({
        where: {
            transactionCardNumber: req.currentUser.idcard,
        },
        order: [['createdAt', 'DESC']]
    });


    if(req.currentUser) {
        res.render('accounts', { deal });
    } else {
        res.redirect('/')
    }
});

router.post('/transfer', asyncHandler(async function(req, res) {
    const userReceive = await User.findUserByIdCard(req.body.beneficiaryCardNumber);
    const userSend = await User.findUserByIdCard(req.currentUser.idcard);
    if(Number(userSend.totalMoney) >= Number(req.body.amounOfMoney)) {
        if(userReceive) {
            userReceive.totalMoney = Number(userReceive.totalMoney) + Number(req.body.amounOfMoney);
            userSend.totalMoney = Number(userSend.totalMoney) - Number(req.body.amounOfMoney);
            userReceive.save();
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
    }
    res.redirect('/accounts');
}));

router.post('/', upload.single('avatar'), function(req, res,nex ) {
    res.render('profile');
});

module.exports = router;