const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const cryptoRandomString = require('crypto-random-string');


const User = require('../services/user');
const Email = require('../services/email');

const router = new Router();




router.get('/', function(req, res){
    res.render('signup', { errEmail: null, errDisplayName: null, errPhone: null, errIdentityCard: null });
});

router.post('/', [
    body('email')
        .isEmail()
        .normalizeEmail()
        .custom(async function (email) {
            const found = await User.findUserByEmail(email);
            if (found) {
                throw Error('Email đã tồn tại');
            }
            return true;
        }),
    body('password')
        .isLength({ min: 6 }),
        
    body('displayName')
            .trim()
            .notEmpty().withMessage('Tên không được đê trống'),
    body('phone')
        .isLength({ min: 9 }).withMessage('Số điện thoại phải ít nhất 6 ký tự'),
    body('identityCard')
        .isLength({ min: 6 }).withMessage('CMND ít nhất phải có 6 ký tự'),
],asyncHandler(async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var errEmail = null;
        var errDisplayName = null;
        var errPhone = null;
        var errIdentityCard = null;
        errors.array().forEach(element => {
            if(element.param ==='email'){
                errEmail = element.msg;
            }
            if(element.param ==='displayName'){
                errDisplayName = element.msg;
            }
            if(element.param ==='phone'){
                errPhone = element.msg;
            }
            if(element.param ==='identityCard'){
                errIdentityCard = element.msg;
            }
        });
      return res.render('signup', { errEmail, errDisplayName, errPhone, errIdentityCard });
    }

    const user = await User.create({
        email: req.body.email,
        displayName: req.body.displayName,
        phone: req.body.phone,
        password: User.hashPassword(req.body.password),
        token: crypto.randomBytes(3).toString('hex').toUpperCase(),
        identityCard: req.body.identityCard,
        idcard: cryptoRandomString({length: 10, type: 'numeric'}),
        totalMoney: 0,
        limit: 10000000,
        activate: 0,
        permission: 0,
    });

    await Email.send(user.email, 'Mã xác thực tài khoản:', `http://localhost:3000/signin/${user.id}/${user.token}`);//${process.env.BASE_URL}
    
    res.redirect('/');


}));

module.exports = router;