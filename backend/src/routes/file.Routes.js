const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const fileController = require("../controllers/file.Controller");
const upload = require("../middlewares/multerMiddleware");
const router = express.Router();

// Route to upload a file for a game
router.post("/upload/:gameId", verifyToken, upload, fileController.uploadGameFile);
router.get("/download/:fileId", verifyToken, fileController.downloadFile);

module.exports = router;
