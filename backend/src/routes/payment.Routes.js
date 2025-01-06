const express = require("express");
const paymentController = require("../controllers/payment.Controller");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create-order", paymentController.createOrder);
router.post("/payment-callback", paymentController.handlePaymentCallback);
router.get("/confirm", paymentController.confirmPaymentStatus);


module.exports = router;
