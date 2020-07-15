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

router.post('/password', asyncHandler(async function(req, res) {
    const user = await User.findUserById(req.session.userId);
    if(req.body.newPassword === req.body.confirmPassword) {
        if(user) {
            user.password = User.hashPassword(req.body.newPassword);
            user.save();
        }
    }
    res.redirect('/logout');
}));

router.post('/changeInfo', asyncHandler(async function(req, res) {
    const user = await User.findUserById(req.session.userId);
    if(user) {
        user.dob = req.body.dob;
        user.address = req.body.address;
        user.wards = req.body.wards;
        user.district = req.body.district;
        user.city = req.body.city;
        user.save();
    }
    res.redirect('/settings');
}));

router.post('/avatar', upload.single('avatar'), function(req, res, nex ) {
    console.log(req.file.avatar);
    res.render('settings');
});

module.exports = router;