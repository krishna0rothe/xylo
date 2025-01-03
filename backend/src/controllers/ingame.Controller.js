const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Game = require("../models/Game");
const GameUserLogin = require("../models/GameUserLogin");
const Razorpay = require("razorpay");
const CoinSell = require("../models/CoinSell");
const CoinOrder = require("../models/CoinOrder");
const GameCoin = require("../models/GameCoin");

const razorpay = new Razorpay({
  key_id: "rzp_test_Kh4q0sjhzZ5eP4",
  key_secret: "oPtRcRDn02y5tjYhN8h13Yn2",
});

exports.gameUserLogin = async (req, res) => {
  const { email, password, gameId, macAddress } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // Check if the game exists
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({
        status: "error",
        message: "Game not found",
      });
    }

    // Find an existing GameUserLogin for the user and game
    const existingGameUserLogin = await GameUserLogin.findOne({
      user: user._id,
      game: gameId,
    });

    if (existingGameUserLogin) {
      // Check if the MAC address matches
      if (existingGameUserLogin.macAddress === macAddress) {
        // Generate a JWT token
        const token = jwt.sign(
          { userId: user._id, gameId, macAddress },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        return res.status(200).json({
          status: "success",
          message: "Login successful",
          token,
        });
      } else {
        return res.status(403).json({
          status: "error",
          message: "Access denied. MAC address mismatch.",
        });
      }
    }

    // If no existing record, create a new one
    const newGameUserLogin = new GameUserLogin({
      user: user._id,
      game: gameId,
      macAddress,
    });

    await newGameUserLogin.save();

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, gameId, macAddress },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      status: "success",
      message: "Login successful and new record created",
      token,
    });
  } catch (error) {
    console.error("Error during game user login:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred during login",
    });
  }
};


exports.addCoins = async (req, res) => {
  const userId = req.user.id; // Correctly extract userId
  const gameId = req.gameId; // Correctly extract gameId
  console.log(req.user, req.gameId);
  const { coinName, coinValue, coinsToAdd } = req.body;

  try {
    // Find existing GameCoin record for the user and game
    let gameCoin = await GameCoin.findOne({ user: userId, game: gameId });

    if (gameCoin) {
      // Update the existing record
      gameCoin.totalCoins += coinsToAdd; // Add coins
      gameCoin.coinValue = coinValue; // Update coin value
      gameCoin.updatedAt = Date.now(); // Update timestamp
      await gameCoin.save();

      return res.status(200).json({
        status: "success",
        message: "Coins successfully added",
        gameCoin,
      });
    }

    // If no record exists, create a new one
    gameCoin = new GameCoin({
      user: userId,
      game: gameId,
      coinName,
      coinValue,
      totalCoins: coinsToAdd,
    });

    await gameCoin.save();

    return res.status(201).json({
      status: "success",
      message: "Coins successfully added",
      gameCoin,
    });
  } catch (error) {
    console.error("Error adding coins:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while adding coins",
    });
  }
};


exports.getUserCoins = async (req, res) => {
  const userId  = req.user.id;
  const  gameId  = req.gameId;

  console.log(userId, gameId)
  try {
    // Find the GameCoin record for the user and game
    const gameCoin = await GameCoin.findOne({ user: userId, game: gameId });

    if (!gameCoin) {
      return res.status(404).json({
        status: "error",
        message: "No coin record found for this user and game",
        coin: 0,
      });
    }

    // Respond with the total coins
    return res.status(200).json({
      status: "success",
      coin: gameCoin.totalCoins,
    });
  } catch (error) {
    console.error("Error fetching user coins:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching user coins",
    });
  }
};

exports.updateCoinUsage = async (req, res) => {
  const  gameId  = req.gameId; // From middleware
  const  userId  = req.user.id; // From middleware
  const { coinsUsed } = req.body; // Number of coins to deduct or add (negative for deduction)
console.log(gameId, userId);
  try {
    // Validate coinsUsed input
    if (typeof coinsUsed !== "number" || coinsUsed === 0) {
      return res.status(400).json({
        status: "error",
        message: "Invalid coinsUsed value. Must be a non-zero number.",
      });
    }

    // Find the GameCoin document for the user and game
    const gameCoin = await GameCoin.findOne({ game: gameId, user: userId });

    if (!gameCoin) {
        console.log(message);
      return res.status(404).json({
        status: "error",
        message: "No coin record found for this user and game.",
      });
      
    }

    // Check if the user has enough coins for deduction
    if (coinsUsed < 0 && gameCoin.totalCoins + coinsUsed < 0) {
      return res.status(400).json({
        status: "error",
        message: "Insufficient coins to complete this transaction.",
      });
    }

    // Update the coin balance
    gameCoin.totalCoins += coinsUsed;
    gameCoin.updatedAt = new Date();
    await gameCoin.save();

    return res.status(200).json({
      status: "success",
      message: "Coin usage updated successfully.",
      updatedCoinBalance: gameCoin.totalCoins,
    });
  } catch (error) {
    console.error("Error updating coin usage:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while updating coin usage.",
    });
  }
};


// Create Coin Order
exports.createCoinOrder = async (req, res) => {
  try {
    const { userId, gameId, coinAmount } = req.body;

    // Validate Game and Coin Value
    const gameCoin = await GameCoin.findOne({ game: gameId });
    if (!gameCoin) {
      return res.status(404).json({ status: "error", message: "Game not found" });
    }

    // Calculate the total price for the coins
    const pricePerCoin = gameCoin.coinValue;
    const totalAmount = coinAmount * pricePerCoin;

    // Create Razorpay order
    const receipt = `coin_order_${gameId}_${Date.now()}`.slice(0, 40); // Ensure receipt length is no more than 40 characters
    const order = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // Razorpay requires amount in paise
      currency: "INR",
      receipt: receipt,
    });

    // Save Coin Order to the database
    const coinOrder = new CoinOrder({
      user: userId, // Use the userId from the request body
      game: gameId,
      coinAmount,
      pricePerCoin,
      totalAmount,
      orderStatus: "pending",
      paymentStatus: "pending",
      transactionId: order.id,
    });

    await coinOrder.save();

    // Respond with order details
    res.status(201).json({
      status: "success",
      message: "Coin purchase order created successfully",
      order,
      coinOrder,
    });
  } catch (error) {
    console.error("Error creating CoinOrder:", error);
    res.status(500).json({
      status: "error",
      message: "Server error, please try again later",
    });
  }
};


// Handle Coin Payment
exports.handleCoinPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Validate Razorpay signature
    const crypto = require("crypto");
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid payment signature" });
    }

    // Find the order and update payment status
    const order = await CoinOrder.findOne({ transactionId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ status: "error", message: "Order not found" });
    }

    order.paymentStatus = "completed";
    await order.save();

    // Create a CoinSell record to reflect the sale
    const coinSell = new CoinSell({
      user: order.user, // The user who made the purchase
      game: order.game,
      coinAmount: order.coinAmount,
      totalAmount: order.totalAmount,
      transactionId: razorpay_payment_id,
      status: "success",
    });

    await coinSell.save();

    // Respond with success
    res.status(200).json({
      status: "success",
      message: "Payment verified and coin order completed",
      coinSell,
    });
  } catch (error) {
    console.error("Error handling Coin Payment:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while handling the payment",
    });
  }
};


// Confirm Coin Payment
exports.confirmCoinPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    // Find the order by Razorpay order ID
    const order = await CoinOrder.findOne({ transactionId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ status: "error", message: "Order not found" });
    }

    // Update the payment status
    order.paymentStatus = "completed";
    await order.save();

    // Create a new record for CoinSell (sale)
    const coinSell = new CoinSell({
      user: order.user, // The user who made the purchase
      game: order.game,
      coinAmount: order.coinAmount,
      totalAmount: order.totalAmount,
      transactionId: razorpay_payment_id,
      status: "success",
    });

    await coinSell.save();

    res.status(200).json({
      status: "success",
      message: "Payment confirmed and coin sale recorded",
      coinSell,
    });
  } catch (error) {
    console.error("Error confirming coin payment:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while confirming payment status.",
    });
  }
};


exports.getGameCoinAndUserInfo = async (req, res) => {
  try {
    const { userId, gameId } = req.params; // Extracting userId and gameId from URL

    // Find Game Coin by Game ID
    const gameCoin = await GameCoin.findOne({ game: gameId });
    if (!gameCoin) {
      return res
        .status(404)
        .json({ status: "error", message: "Game Coin not found" });
    }

    // Find User info by User ID, selecting only id, name, and email
    const user = await User.findById(userId).select("_id name email");
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    // Find Game Info by Game ID, selecting only id, createdBy, and one image
    const game = await Game.findById(gameId).select("_id createdBy images");
    if (!game) {
      return res
        .status(404)
        .json({ status: "error", message: "Game not found" });
    }

    // Return filtered game coin, user, and game info
    res.status(200).json({
      status: "success",
      message: "Game coin, user, and game info fetched successfully",
      gameCoin, // Return all fields from gameCoin
      user, // Filtered: id, name, email
      game: {
        _id: game._id,
        createdBy: game.createdBy,
        image: game.images[0], // Return only the first image
      },
    });
  } catch (error) {
    console.error("Error fetching game coin, user, and game info:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while fetching data",
    });
  }
};