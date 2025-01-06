const mongoose = require("mongoose");

const GameCoinSchema = new mongoose.Schema(
  {
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game", // The game this coin system belongs to
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // The user who owns these coins
      required: true,
    },
    coinName: {
      type: String,
      required: true, // Name of the coin (e.g., "Gold Coins")
    },
    coinValue: {
      type: Number,
      required: true, // How much one coin is worth in INR
    },
    totalCoins: {
      type: Number,
      required: true, // Total number of coins the user has
    },
    updatedAt: {
      type: Date,
      default: Date.now, // Time when the coin value was last updated
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GameCoin", GameCoinSchema);
