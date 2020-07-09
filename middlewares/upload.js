const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + req.currentUser.id + '.png')
    }
  });
  
const upload = multer({ storage: storage });

module.exports = upload;