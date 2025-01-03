const mongoose = require("mongoose");

const GameUserLoginSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // The user who logged in
      required: true,
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game", // The game the user is logging into
      required: true,
    },
    macAddress: {
      type: String,
      required: true, // Store the MAC address of the user's device
    },
    deviceInfo: {
      type: String, // Optional: You can store the device's OS, version, etc.
    },
    loginTimestamp: {
      type: Date,
      default: Date.now, // When the user logged in
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

module.exports = mongoose.model("GameUserLogin", GameUserLoginSchema);
