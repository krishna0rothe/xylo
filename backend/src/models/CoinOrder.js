const mongoose = require("mongoose");

const CoinOrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // The buyer (user who is making the order)
      required: true,
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game", // The game for which coins are being ordered
      required: true,
    },
    coinAmount: {
      type: Number, // Number of coins ordered
      required: true,
    },
    pricePerCoin: {
      type: Number, // Price of one coin in INR
      required: true,
    },
    totalAmount: {
      type: Number, // Total amount (coinAmount * pricePerCoin)
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "completed", "cancelled"], // Status of the order
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"], // Payment status
      default: "pending",
    },
    transactionId: {
      type: String, // Unique transaction ID
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, // Time when the order was created
    },
    updatedAt: {
      type: Date,
      default: Date.now, // Time when the order was last updated
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CoinOrder", CoinOrderSchema);
