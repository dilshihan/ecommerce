const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: 'uploads/', 
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ 
    storage, 
    limits: { 
        fileSize: 100 * 1024 * 1024, // 100MB file limit
        fieldSize: 100*1024 * 1024 // 100MB max for text fields
    },
}).array('image', 3);

module.exports = upload;

