const multer = require("multer");
const path = require("path");

// Set up the file storage using Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../uploads"); // Ensure this path is correct relative to your project
    console.log("Uploading to:", uploadPath); // Debugging the upload path
    cb(null, uploadPath); // Ensure the directory exists
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname); // Generate a unique name using timestamp
    cb(null, uniqueName); // Set the unique filename for the uploaded file
  },
});

// Initialize multer with file size limit of 20MB and valid file types
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter: (req, file, cb) => {
    const validTypes = [".zip", ".apk", ".exe", ".tar", ".rar"]; // Allowed file types
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (validTypes.includes(fileExtension)) {
      return cb(null, true); // Accept the file
    } else {
      return cb(new Error("Invalid file type"), false); // Reject the file with an error
    }
  },
}).single("file"); // 'file' is the field name from the form-data in Postman

// Export the middleware
module.exports = upload;
