const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Proper path for Render
const uploadDir = path.join(__dirname, "..", "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage settings
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, Date.now() + "-" + sanitizedOriginalName);
    }
});

// File filters
const resumeFileFilter = (req, file, cb) => {
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    allowedTypes.includes(file.mimetype)
        ? cb(null, true)
        : cb(new Error("Invalid file type for resume"), false);
};

const certificateFileFilter = (req, file, cb) => {
    const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png"
    ];
    allowedTypes.includes(file.mimetype)
        ? cb(null, true)
        : cb(new Error("Invalid file type for certificate"), false);
};

const resumeUpload = multer({
    storage,
    fileFilter: resumeFileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

const certificateUpload = multer({
    storage,
    fileFilter: certificateFileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

// Multer error handler
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();
};

module.exports = { resumeUpload, certificateUpload, handleMulterError };
