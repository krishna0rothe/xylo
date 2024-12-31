const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Studio", // References the Studio model
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  images: [
    {
      type: String, // Array of image URLs or paths
    },
  ],
  platform: {
    type: [String], // e.g., ["mobile", "desktop"]
    required: true,
  },
  category: {
    type: String, // e.g., "action", "adventure"
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "File", // This will be referenced once the File model is created
  },
  req: {
    min: {
      type: String, // Minimum system requirements
    },
    max: {
      type: String, // Maximum system requirements
    },
  },
  tags: [
    {
      type: String, // e.g., "single player", "RPG"
    },
  ],
  version: {
    type: String, // Game version
    required: true,
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

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
