const Razorpay = require("razorpay");
const Order = require("../models/Order");
const Sell = require("../models/Sell");
const GameMetadata = require("../models/GameMetadata");
const Game = require("../models/Game");
const { getOrderDetails } = require("../utils/orderDetails");
const { generateFancyInvoicePDF } = require("../utils/pdfGenerator");
const { sendEmail } = require("../services/emailService");
const User = require('../models/User');
const Studio = require('../models/Studio');



const razorpay = new Razorpay({
  key_id: "rzp_test_Kh4q0sjhzZ5eP4",
  key_secret: "oPtRcRDn02y5tjYhN8h13Yn2",
});


exports.createOrder = async (req, res) => {
  const { amount, userId, gameId } = req.body;
    console.log("Amount:", amount);
    console.log("User ID:", userId);
    console.log("Game ID:", gameId);
  try {
    const options = {
      amount: amount, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `order_rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    const newOrder = new Order({
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      user: userId,
      game: gameId,
      status: "created",
    });

    await newOrder.save();

    res.status(201).json({ status: "success", order });
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to create order" });
  }
};

exports.handlePaymentCallback = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } =
    req.body;

  try {
    // Verify payment (optional, can use Razorpay's utility to verify signature)
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
      return res
        .status(404)
        .json({ status: "error", message: "Order not found" });
    }

    // Update the order status
    order.status = "paid";
    await order.save();

    // Create a Sell record
    const sell = new Sell({
      game: order.game,
      order: order._id,
      buyer: userId,
      amount: order.amount / 100, // Convert from paise to INR
      transactionId: razorpay_payment_id,
    });

    await sell.save();

    res
      .status(200)
      .json({ status: "success", message: "Payment successful", sell });
  } catch (error) {
    console.error("Error handling payment callback:", error);
    res
      .status(500)
      .json({ status: "error", message: "Payment processing failed" });
  }
};

exports.confirmPaymentStatus = async (req, res) => {
  const { userId, gameId } = req.query;

  try {
    // Check if the user has a successful purchase for the game
    const sellRecord = await Sell.findOne({
      buyer: userId,
      game: gameId,
      status: "success",
    });

    if (sellRecord) {
      res.status(200).json({
        status: "success",
        message: "Payment confirmed. User can download the game.",
      });

      // Call the function to fetch order details and generate the invoice
      fetchOrderAndGenerateInvoice(userId, gameId);
    } else {
      res.status(404).json({
        status: "error",
        message: "No successful payment found for this game.",
      });
    }
  } catch (error) {
    console.error("Error confirming payment status:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while confirming payment status.",
    });
  }
};

/**
 * Fetch order details and generate/send invoice.
 */
async function fetchOrderAndGenerateInvoice(userId, gameId) {
  try {
    // Get the sell record
    const sellRecord = await Sell.findOne({
      buyer: userId,
      game: gameId,
      status: "success",
    });
    if (!sellRecord) throw new Error("Sell record not found.");

    // Fetch buyer details
    const buyer = await User.findById(sellRecord.buyer);
    if (!buyer) throw new Error("Buyer not found.");

    // Fetch seller details (via game -> createdBy -> Studio)
    const game = await Game.findById(gameId);
    if (!game) throw new Error("Game not found.");
    const seller = await Studio.findById(game.createdBy);
    if (!seller) throw new Error("Seller not found.");

    // Prepare details for the invoice
    const invoiceData = {
      transactionId: sellRecord._id,
      buyer: {
        name: buyer.name,
        email: buyer.email,
      },
      seller: {
        name: seller.name,
        email: seller.email,
      },
      game: {
        name: game.name,
        price: game.price,
      },
    };

    // Generate the PDF
    const pdfPath = await generateFancyInvoicePDF(invoiceData);

    // Send the invoice to the buyer
    await sendEmail({
      to: buyer.email,
      subject: "Your Payment Invoice - Xylo",
      text: `Hello ${buyer.name},\n\nPlease find attached your payment invoice for "${game.name}".\n\nThank you for your purchase!`,
      attachments: [
        {
          filename: `invoice_${sellRecord._id}.pdf`,
          path: pdfPath,
        },
      ],
    });

    console.log("Invoice sent successfully to:", buyer.email);
  } catch (error) {
    console.error("Error generating/sending invoice:", error.message);
  }
}

