const multer = require('multer');
const path = require('path');

// Storage Configuration
const storage = multer.diskStorage({
    destination : function(req, file, cb) {
        cb(null, 'uploads/'); // Destination folder for uploaded files
    },
    filename : function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

// File Filter to accept images
const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept the file
    }
    else {
        cb(new Error('Not an image! Please upload an image.'), false); // Reject the file
    }
};

// Initialize multer instance
const upload = multer({
    storage, fileFilter
});

module.exports = upload; // Export the multer instance for use in routes