const mongoose = require("mongoose");

const sellSchema = new mongoose.Schema({
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
    required: true,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  paymentMethod: {
    type: String,
    default: "Razorpay",
  },
  status: {
    type: String,
    enum: ["success", "refund", "failed"],
    default: "success",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Sell", sellSchema);
    