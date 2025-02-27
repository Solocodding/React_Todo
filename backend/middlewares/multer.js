const multer = require("multer");
const path = require("path");
const fs = require("fs");

// const userDir = path.join(__dirname, "../uplaods");
const userDir =  "./uploads";
if(!fs.existsSync(userDir)){
    fs.mkdirSync(userDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, userDir);
    },
    filename: (req, file, cb) => {
        // cb(null,  req.body.userId + path.extname(file.originalname));
        cb(null,  `${req.body.userId}.jpg`);
    },
})
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg'];
    const fileMimeType = file.mimetype;
    if(!allowedMimeTypes.includes(fileMimeType)){
        return cb(null, false);
    }
    return cb(null, true);
}
const upload = multer({ storage, fileFilter });
module.exports = upload;