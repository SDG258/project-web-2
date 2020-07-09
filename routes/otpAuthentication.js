const { Router } = require('express');
const cryptoRandomString = require('crypto-random-string');
const asyncHandler = require('express-async-handler');

const User = require('../services/user');
const SMS = require('../services/sms');

const router = new Router();

router.get('/', function getLogin(req, res) {
    res.render('otp-2');
});

router.post('/', asyncHandler(async function postLogin(req, res) {
    const user = await User.findUserById(req.session.userId);

    if(user && user.sms != req.body.sms) {
        return res.redirect('signin');
    } else {
        user.sms = null;
        user.save();
    }

    res.redirect('dashboard.html');

}));

module.exports = router;
router.post('/', asyncHandler(async function postLogin(req, res) {
    const user = await User.findUserById(req.session.userId);
    if(user.sms != req.body.sms) {
        return res.render('signin');
    }

    req.session.userId = user.id;
    res.redirect('dashboard.html');
}));