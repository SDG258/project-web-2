const { Router } = require('express');
const upload = require('../middlewares/upload');
const User = require('../services/user');
const router = new Router();
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

router.post('/:id', asyncHandler(async function (req, res, next) {
    const { id } = req.params;
    const {select} = req.body;
    console.log(select);
    console.log(id);
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
    //res.redirect('/accounts-admin');

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


// router.post('/', upload.single('avatar'), function(req, res,nex ) {
//     res.render('profile');
// });

module.exports = router;