const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const cryptoRandomString = require('crypto-random-string');

const Saving = require('../services/saving');
const User = require('../services/user');
const Deal = require('../services/deal');
const upload = require('../middlewares/upload');
const { TodayInstance } = require('twilio/lib/rest/api/v2010/account/usage/record/today');
const router = new Router();

router.get('/', async function findUserByIdCard(req, res) {
    const deal =  await Deal.findAll({
        where: {
            transactionCardNumber: req.currentUser.idcard,
        },
        order: [['createdAt', 'DESC']]
    });

    const saving = await Saving.findAll({
        where: {
            transactionCardNumber: req.currentUser.idcard,
        },
        order: [['createdAt', 'DESC']]
    });

    if(req.currentUser) {
        res.render('saving', { saving, deal });
    } else {
        res.redirect('/')
    }
});

router.post('/', asyncHandler(async function(req, res) {
    const user = await User.findUserByIdCard(req.currentUser.idcard);
    if(Number(user.totalMoney) >= Number(req.body.amounOfMoney)) {
        if(user) {
            user.totalMoney = Number(user.totalMoney) - Number(req.body.amounOfMoney);
            user.save();
            const saving = await Saving.create({
                transactionCardNumber: user.idcard,
                amounOfMoney: req.body.amounOfMoney,
                interestRate: req.body.select.substr(0, req.body.select.length-2),
                duration: req.body.select.replace(req.body.select.substr(0, req.body.select.length-2),0),
                status: '0',
                transactionNumber: cryptoRandomString({length: 5, type: 'numeric'}),
            }).then(function(user) {
                console.log('success');
            })
            .catch(function(err) {
                console.log(err);
            });
        }
    }
    res.redirect('/saving');
}));

router.get('/withdrawal/:id', asyncHandler(async function(req, res) {
    const user = await User.findUserByIdCard(req.currentUser.idcard);
    const saving = await Saving.findByTransactionNumber(req.params.id);

    const today = new Date();

    const sentMonth = saving.createdAt.getMonth() + 1;
    const sentYear = saving.createdAt.getYear();

    if(sentMonth + saving.duration === today.getMonth()+1 && sentYear ===saving.createdAt.getYear()) {
        if(user) {
            user.totalMoney = user.totalMoney + saving.amounOfMoney * saving.interestRate * (saving.duration)/12
            user.save();
        }
    } else {
        if(user) {
            //Số tiền lãi = Số tiền gửi x lãi suất (%/năm) x số ngày thực gửi/360
            user.totalMoney = user.totalMoney + saving.amounOfMoney * saving.interestRate //* (saving.duration)/12
            user.save();
        }
    }

    saving.status = '1'
    saving.save();

    res.redirect('/saving');
}));

module.exports = router;