const Razorpay = require("razorpay");
const Asset = require("../models/Asset");
const AssetOrder = require("../models/AssetOrder");
const AssetSales = require("../models/AssetSales");

const razorpay = new Razorpay({
  key_id: "rzp_test_Kh4q0sjhzZ5eP4",
  key_secret: "oPtRcRDn02y5tjYhN8h13Yn2",
});

exports.createAssetOrder = async (req, res) => {
  try {
    const { assetId } = req.body;

    // Validate asset
    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res
        .status(404)
        .json({ status: "error", message: "Asset not found" });
    }

    // Check price (free assets don't require payment)
    if (!asset.price || asset.price <= 0) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "This asset is free and doesn't require an order.",
        });
    }

    // Create Razorpay order
    const receipt = `asset_${asset._id}_${Date.now()}`.slice(0, 40); // Ensure receipt length is no more than 40 characters
    const order = await razorpay.orders.create({
      amount: Math.round(asset.price * 100), // Razorpay requires amount in paise
      currency: "INR",
      receipt: receipt,
    });

    // Save order details to AssetOrder
    const assetOrder = new AssetOrder({
      asset: asset._id,
      buyer: req.user._id, // Assuming user ID is available in req.user
      orderId: order.id,
      amount: asset.price,
    });

    await assetOrder.save();

    res.status(201).json({
      status: "success",
      message: "Order created successfully",
      order
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        status: "error",
        message: "Server error, please try again later",
      });
  }
};

exports.handleAssetPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Validate Razorpay signature
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
    const order = await AssetOrder.findOne({ orderId: razorpay_order_id });
    if (!order) {
      return res
        .status(404)
        .json({ status: "error", message: "Order not found" });
    }

    order.paymentStatus = "completed";
    await order.save();

    // Record the sale
    const sale = new AssetSales({
      asset: order.asset,
      seller: order.asset.createdBy,
      buyer: order.buyer,
      amount: order.amount,
    });

    await sale.save();

    res.status(200).json({
      status: "success",
      message: "Payment verified and order completed",
      sale,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        status: "error",
        message: "Server error, please try again later",
      });
  }
};

exports.confirmAssetPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    // Find the order by Razorpay order ID
    const order = await AssetOrder.findOne({ orderId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ status: "error", message: "Order not found" });
    }

    // Fetch the asset to get the seller information
    const asset = await Asset.findById(order.asset);
    if (!asset) {
      return res.status(404).json({ status: "error", message: "Asset not found" });
    }

    // Update the order status
    order.paymentStatus = "completed";
    await order.save();

    // Create a new record in AssetSales
    const sale = new AssetSales({
      asset: order.asset,
      seller: asset.author,
      buyer: order.buyer,
      amount: order.amount,
    });

    await sale.save();

    res.status(200).json({
      status: "success",
      message: "Payment confirmed and sale recorded",
      sale,
    });
  } catch (error) {
    console.error("Error confirming asset payment:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while confirming payment status.",
    });
  }
};