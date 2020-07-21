const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const Deal = require('../services/deal');
const User = require('../services/user');
const upload = require('../middlewares/upload');
const router = new Router();

router.get('/', function profile(req, res) {
    if(req.currentUser) {
        res.render('accounts');
    } else {
        res.redirect('/');
    }
});

router.post('/transfer', asyncHandler(async function(req, res) {
    const userReceive = await User.findUserByIdCard(req.body.beneficiaryCardNumber);
    const userSend = await User.findUserByIdCard('4118656180');
    console.log(userSend.totalMoney);
    console.log(req.body.amounOfMoney);
    if(Number(userSend.totalMoney) > Number(req.body.amounOfMoney)) {
        console.log('Song Du');
        if(userReceive) {
            userReceive.totalMoney = userReceive.totalMoney + req.body.amounOfMoney;
            userSend.totalMoney = userSend.totalMoney - req.body.amounOfMoney;
            userReceive.save();
            userSend.save();
            const deal = await Deal.create({
                transactionCardNumber: '3586088953',
                amounOfMoney: req.body.amounOfMoney,
                beneficiaryCardNumber: req.body.beneficiaryCardNumber,
                tradingName: req.body.tradingName,
            });
        }
    }
    res.redirect('/accounts');
}));

router.post('/', upload.single('avatar'), function(req, res,nex ) {
    res.render('profile');
});

module.exports = router;