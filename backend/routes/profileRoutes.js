const express=  require('express');
const router = express.Router();
const {uploadUserPhoto} = require('../controllers/profileController');
const upload = require('../middlewares/multer');

router.post('/uploadPhoto',upload.single('image'), uploadUserPhoto);

module.exports=router;