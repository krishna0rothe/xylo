const express = require("express");
const assetpaymentController = require("../controllers/assetpayment.Controller");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create-order", verifyToken, assetpaymentController.createAssetOrder);
router.post("/handle-payment", verifyToken, assetpaymentController.handleAssetPayment);
router.post(
  "/confirm-payment",
  verifyToken,
  assetpaymentController.confirmAssetPayment
);
module.exports = router;
