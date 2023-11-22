/** @format */

const multer = require('multer');
const upload = multer({ dest: 'src/public/uploads/images' });
const path = require('path');
const mulStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/public/uploads/images');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
    // cb(null, file.originalname);
  },
});
const mulUpload = multer({
  storage: mulStorage,
  fileFilter: (req, file, callback) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
      callback(null, true);
    } else {
      console.log('Only JPG/PNG file supported!');
      callback(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
});

module.exports = {
  upload,
  mulUpload,
};
