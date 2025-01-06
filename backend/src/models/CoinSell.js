const mongoose = require("mongoose");

const CoinSellSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // The buyer (user who is purchasing coins)
      required: true,
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game", // The game for which the coin is being bought
      required: true,
    },
    coinAmount: {
      type: Number, // The number of coins the user is purchasing
      required: true,
    },
    totalAmount: {
      type: Number, // Total amount in INR (converted from coins)
      required: true,
    },
    transactionId: {
      type: String, // Unique transaction ID for tracking
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"], // Payment status
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now, // Time when the transaction was created
    },
    updatedAt: {
      type: Date,
      default: Date.now, // Time when the transaction was last updated
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CoinSell", CoinSellSchema);
