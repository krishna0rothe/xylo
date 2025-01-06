const mongoose = require("mongoose");

const GameSaleSchema = new mongoose.Schema(
  {
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game", // The game for which the sale is made
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Studio", // The studio selling the in-game items or coins
      required: true,
    },
    coinsSold: {
      type: Number,
      required: true, // Number of coins sold
    },
    amountEarned: {
      type: Number,
      required: true, // Amount earned by the seller in INR
    },
    transactionId: {
      type: String,
      required: true, // Transaction ID for the sale
    },
    saleDate: {
      type: Date,
      default: Date.now, // Date when the sale was completed
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GameSale", GameSaleSchema);
