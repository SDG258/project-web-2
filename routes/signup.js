const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const cryptoRandomString = require('crypto-random-string');

const User = require('../services/user');
const Email = require('../services/email');

const router = new Router();

router.get('/', function(req, res){
    res.render('signup');
});

router.post('/', [
    body('email')
        .isEmail()
        .normalizeEmail()
        .custom(async function (email) {
            const found = await User.findUserByEmail(email);
            if (found) {
                throw Error('User exits');
            }
            return true;
        }),
    body('password')
        .isLength({ min: 6 }),
    body('displayName')
            .trim()
            .notEmpty(),
    body('identityCard')
        .isLength({ min: 6 }),
],asyncHandler(async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('register', { errors: errors.array() });
    }
    const user = await User.create({
        email: req.body.email,
        displayName: req.body.displayName,
        password: User.hashPassword(req.body.password),
        token: crypto.randomBytes(3).toString('hex').toUpperCase(),
        identityCard: req.body.identityCard,
        idcard: cryptoRandomString({length: 10, type: 'numeric'}),
        totalMoney: 0,
    });

    await Email.send(user.email, 'Mã xác thực tài khoản:', `http://localhost:3000/login/${user.id}/${user.token}`);//${process.env.BASE_URL}
    
    res.redirect('/');


}));

module.exports = router;