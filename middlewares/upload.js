// const multer = require('multer');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, '../public/images')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + req.currentUser.id + '.png')
//     }
//   });
  
// const upload = multer({ storage: storage });

// module.exports = upload;
const multer = require('multer');
const fs = require("fs");

var storage1 = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/images');
  },
  filename: function (req, file, callback) {
    callback(null,`${req.session.userId}` + '-' + 'frontImage' + '.png' );
  }
});