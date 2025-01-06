// utils/orderDetails.js
const Sell = require("../models/Sell");
const GameMetadata = require("../models/GameMetadata");
const Game = require("../models/Game");

const getOrderDetails = async (userId, gameId) => {
  try {
    // Find the sell record
    const sellRecord = await Sell.findOne({
      buyer: userId,
      game: gameId,
      status: "success",
    })
      .populate("buyer", "name email")
      .populate("seller", "name email")
      .populate("game", "name price");

    if (!sellRecord) {
      throw new Error("No successful payment record found.");
    }

    // Find the game metadata
    const metadata = await GameMetadata.findOne({ game: gameId });

    if (!metadata) {
      throw new Error("Game metadata not found.");
    }

    return {
      sellRecord,
      metadata,
    };
  } catch (error) {
    throw new Error(`Failed to fetch order details: ${error.message}`);
  }
};

module.exports = { getOrderDetails };
