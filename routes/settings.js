const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const upload = require('../middlewares/upload');
const User = require('../services/user');


const router = new Router();

router.get('/', function profile(req, res) {
    if(req.currentUser) {
        res.render('settings');
    } else {
        res.redirect('/');
    }
});

router.post('/', asyncHandler(async function(req, res) {
    const user = await User.findUserById(req.session.userId);
    console.log(req.body.newPassword);
    console.log(req.body.confirmPassword)
    if(req.body.newPassword === req.body.confirmPassword) {
        if(user) {
            user.password = User.hashPassword(req.body.newPassword);
            user.save();
        }
    }
    res.redirect('logout');
}));

router.post('/', upload.single('avatar'), function(req, res, nex ) {
    res.render('settings');
});

module.exports = router;