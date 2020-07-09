const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const User = require('../services/user');
const SMS = require('../services/sms');

const router = new Router();

router.get('/', function getLogin(req, res) {
    res.render('signin');
});

router.post('/', asyncHandler(async function postLogin(req, res) {
    const user = await User.findUserByEmail(req. currentUser.id);
    if(!user || req.body.sms != user.sms) {
        return res.render('otp-1');
    }
    
    req.session.userId = user.id;
    await SMS.send(user.phone, `Mã xác thực tài khoản: ${user.sms}`);
    res.render('dashboard');
}));

router.post('/', asyncHandler(async function(req, res) {
    const { id, sms } = req.params;
    const user = await User.findUserById(id);
    if(user && user.sms === sms) { 
        user.sms = null;
        user.save();
        req.session.userId = user.id;
    }
    res.redirect('/');
}))

module.exports = router;