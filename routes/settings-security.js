const { Router } = require('express');
const cryptoRandomString = require('crypto-random-string');
const asyncHandler = require('express-async-handler');

const User = require('../services/user');

const router = new Router();

router.get('/', function getLogin(req, res) {
    res.render('settings-security');
});

router.post('/', asyncHandler(async function postLogin(req, res) {
    const user = await User.findUserById(req.session.userId);

    if(user) { 
        user.sms = cryptoRandomString({length: 4, type: 'numeric'});
        user.save();
    }

    await SMS.send(user.phone, `Mã xác thực tài khoản: ${user.sms}`);

    res.redirect('otp-2');

}));

module.exports = router;