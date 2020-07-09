const { Router } = require('express');
const upload = require('../middlewares/upload');

const router = new Router();

router.get('/', function profile(req, res) {
    if(req.currentUser) {
        res.render('profile');
    } else {
        res.redirect('/');
    }
});


router.post('/', upload.single('avatar'), function(req, res,nex ) {
    res.render('profile');
});

module.exports = router;