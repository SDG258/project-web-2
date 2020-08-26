const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const multer = require('multer');
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

router.post('/avatar',function(req,res){

    
    var storage1 = multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, './public/images');
      },
      filename: function (req, file, callback) {
        callback(null,`${req.session.userId}` + '-' + 'frontImage' + '.png' );
      }
    });

    var frontUpload = multer({ storage : storage1 }).array('frontImage',1);
    frontUpload(req,res,function(err) {  
        if(err) {
          res.redirect('/acc_authentication');
         return res.end();
        }
        res.redirect('/acc_authentication')
        res.end();
    });
  });

// router.post('/avatar', upload.single('avatar'), function(req, res, nex ) {
//     console.log(req.file);
//     res.render('settings');
// });

module.exports = router;