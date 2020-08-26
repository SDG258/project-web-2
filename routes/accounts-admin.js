const router = require("express").Router();
const upload = require('../middlewares/upload');
const User = require('../services/user');
const asyncHandler = require('express-async-handler');

router.get('/', asyncHandler(async function (req, res) {
    if (req.currentUser) {
        const user = await User.findUserById(req.currentUser.id);
        const listUser = await User.findAll();
        res.locals.user = user;
        res.render('accounts-admin', { listUser });
    } else {
        res.redirect('/');
    }
}));

router.post('/search/:id', asyncHandler(async function (req, res, next) {
    const { id } = req.params;
    const { select } = req.body;
    const user = await User.findUserById(id);
    console.log(typeof user.activate)
    if (user) {
        await User.update({
            activate: req.body.select,
        }, {
            where: {
                id,
            }
        });
    }
    return res.redirect("back");

}));

router.get('/edit/:id', asyncHandler(async function (req, res, next) {
    const { id } = req.params;
    const user = await User.findUserById(id);
    res.render('editInfoUser', { user });
}));

router.post('/edit/:id', asyncHandler(async function (req, res, next) {
    const { id } = req.params;
    const user = await User.findUserById(id);
    if (user) {
        user.dob = req.body.dob;
        user.address = req.body.address;
        user.wards = req.body.wards;
        user.district = req.body.district;
        user.city = req.body.city;
        user.totalMoney = req.body.totalMoney;
        user.save();
    }
    res.redirect('/accounts-admin');
}));

// Mark
router.post('/search', asyncHandler(async function (req, res) {
    const { email } = req.body;
    const userSearch = await User.findUserByEmail(email);

    const listUser = [];
    listUser.push(userSearch);

    console.log(userSearch);
    return res.render('accounts-admin', { listUser });
}));

module.exports = router;