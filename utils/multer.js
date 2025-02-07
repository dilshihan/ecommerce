const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: 'uploads/', // Save files in "uploads" directory
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage });

module.exports = upload;
