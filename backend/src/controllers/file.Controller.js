const path = require("path");
const fs = require("fs");
const multer = require("multer");
const File = require("../models/File");
const Game = require("../models/Game");
const Studio = require("../models/Studio");
const GameMetadata = require("../models/GameMetadata");

// Set up the file storage using Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Uploading to:", path.join(__dirname, "../../uploads")); // Debugging the upload path
    cb(null, path.join(__dirname, "../../uploads")); // Ensure the directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use a timestamp to make it unique
  },
});

// Initialize multer with file size limit of 20MB and valid file types
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const validTypes = [".zip", ".apk", ".exe", ".tar", ".rar"];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (validTypes.includes(fileExtension)) {
      return cb(null, true); // Accept the file
    } else {
      return cb(new Error("Invalid file type"), false); // Reject the file
    }
  },
}).single("file"); // 'file' must match the key in the form-data request

// POST endpoint to upload file for a game
exports.uploadGameFile = async (req, res) => {
  console.log('File in request:', req.file); // Log the uploaded file for debugging

  if (!req.file) {
    return res.status(400).json({ status: 'error', message: 'No file provided' });
  }

  // Extract game ID from params and studio ID from the JWT (req.user)
  const { gameId } = req.params;
  const { _id: studioId } = req.user;

  try {
    // Find the game to ensure it exists
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ status: 'error', message: 'Game not found' });
    }

    // Check if the game already has an uploaded file
    if (game.file) {
      return res.status(400).json({
        status: 'error',
        message: 'This game already has a file uploaded. Only one file can be uploaded.'
      });
    }

    // Check if the studio is authorized to upload for this game
    if (game.createdBy.toString() !== studioId.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to upload this file'
      });
    }

    // Create a new File model entry with the details of the uploaded file
    const newFile = new File({
      game: gameId,
      createdBy: studioId,
      fileSize: req.file.size,
      location: path.join('uploads', req.file.filename), // Relative file location
      type: path.extname(req.file.originalname),
    });

    // Save the file model to the database
    const savedFile = await newFile.save();

    // Update the Game model with the reference to the new file
    game.file = savedFile._id;
    await game.save();

    // Return the response with the saved file details
    res.status(201).json({
      status: 'success',
      message: 'File uploaded successfully',
      file: savedFile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};


exports.downloadFile = async (req, res) => {
  const { gameId } = req.params;

  try {
    // Find the game by its ID to get the file reference
    const game = await Game.findById(gameId).select("file");
    if (!game) {
      return res
        .status(404)
        .json({ status: "error", message: "Game not found" });
    }

    // If no file is associated with the game, return an error
    if (!game.file) {
      return res
        .status(404)
        .json({ status: "error", message: "No file available for this game" });
    }

    // Find the file object by its ID
    const file = await File.findById(game.file);
    if (!file) {
      return res
        .status(404)
        .json({ status: "error", message: "File not found" });
    }

    // Determine the file path
    const filePath = path.join(__dirname, "../../", file.location);

    // Check if the file exists on the server
    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ status: "error", message: "File not found on server" });
    }

    // Increment the numberOfDownloads field in the gameMetadata model
    const metadata = await GameMetadata.findOne({ game: gameId });
    if (metadata) {
      metadata.numberOfDownloads += 1;
      await metadata.save();
    }

    // Set the response headers to force the file download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${path.basename(filePath)}`
    );
    res.setHeader("Content-Type", "application/octet-stream"); // Forces download as binary data

    // Pipe the file to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.on("open", function () {
      fileStream.pipe(res); // Stream the file content to the response
    });
    fileStream.on("error", function (err) {
      res
        .status(500)
        .json({ status: "error", message: "File download failed" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
};