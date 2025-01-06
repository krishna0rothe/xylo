const mongoose = require("mongoose");

const AssetSalesSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AssetSales", AssetSalesSchema);
