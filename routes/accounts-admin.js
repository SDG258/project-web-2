const { Router } = require('express');
const upload = require('../middlewares/upload');
const User = require('../services/user');
const router = new Router();
const asyncHandler = require('express-async-handler');
router.get('/',   asyncHandler(async function (req, res) {
    if(req.currentUser) {
        const user = await User.findById(id)
        res.locals.user = user;        
        res.render('accounts-admin', { user });
    } else {
        res.redirect('/');
    }
}));


router.post('/', upload.single('avatar'), function(req, res,nex ) {
    res.render('profile');
});

module.exports = router;