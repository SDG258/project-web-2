const { Router } = require('express');
const upload = require('../middlewares/upload');

const router = new Router();

router.get('/', function profile(req, res) {
    if(req.currentUser) {
        res.render('settings');
    } else {
        res.redirect('/');
    }
});


router.post('/', upload.single('avatar'), function(req, res,nex ) {
    res.render('settings');
});

module.exports = router;