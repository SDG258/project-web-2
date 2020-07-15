const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');

const User = require('../services/user');
const Email = require('../services/email');
const email = require('../services/email');

const router = new Router();

router.get('/', function(req, res){
    res.render('reset');
});


router.post('/', asyncHandler(async function postLogin(req, res) {
    const user = await User.findUserByEmail(req.body.email);
    if(!user) {
        return res.render('signin');
    }

    req.session.userId = user.id;

    if(user) { 
        password = crypto.randomBytes(3).toString('hex').toUpperCase();
        user.password = User.hashPassword(password)
        user.save();
        req.session.userId = user.id;
    }
    
    await Email.send(user.email, `Mật khẩu của bạn là: ${password}`);
    res.redirect('/');
}));

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
],asyncHandler(async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('siginup', { errors: errors.array() });
    }


    await Email.send(user.email, `Mật khẩu của bạn là: ${password}`);
    
    res.redirect('/');


}));

module.exports = router;