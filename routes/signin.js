const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const User = require('../services/user');

const router = new Router();

router.get('/', function getLogin(req, res) {
    res.render('signin');
});

router.post('/', asyncHandler(async function postLogin(req, res) {
    const user = await User.findUserByEmail(req.body.email);
    if(!user || !User.verifyPassword(req.body.password, user.password) || !user.token === null) {
        return res.render('signin');
    }

    req.session.userId = user.id;
    res.redirect('otp-1');
}));

router.get('/:id/:token', asyncHandler(async function(req, res) {
    const { id, token } = req.params;
    const user = await User.findUserById(id);
    if(user && user.token === token) { 
        user.token = null;
        user.save();
        req.session.userId = user.id;
    }
    res.redirect('/signin');
}))

module.exports = router;