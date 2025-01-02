const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, "../../uploads/assets");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up Multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Set destination to the 'assets' directory
  },
  filename: (req, file, cb) => {
    const fileName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, fileName); // Generate a unique file name
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
