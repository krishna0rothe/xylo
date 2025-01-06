const mongoose = require("mongoose");

const GamePurchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // User making the purchase
      required: true,
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game", // The game in which the purchase is made
      required: true,
    },
    coinsPurchased: {
      type: Number,
      required: true, // Number of coins purchased
    },
    amountPaid: {
      type: Number,
      required: true, // Amount paid in INR
    },
    purchaseDate: {
      type: Date,
      default: Date.now, // When the purchase was made
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending", // Status of the purchase
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GamePurchase", GamePurchaseSchema);
