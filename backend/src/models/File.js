const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game", // References the Game model
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Studio", // References the Studio model
    required: true,
  },
  fileSize: {
    type: Number, // File size in bytes
    required: true,
  },
  location: {
    type: String, // File location (e.g., S3 URL or local path)
    required: true,
  },
  type: {
    type: String, // File type (e.g., .zip, .apk)
    required: true,
    enum: [".zip", ".apk", ".exe", ".tar", ".rar"], // Add more types as needed
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const File = mongoose.model("File", fileSchema);

module.exports = File;
