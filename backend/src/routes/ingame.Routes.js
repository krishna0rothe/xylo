const express = require("express");
const ingameController = require("../controllers/ingame.Controller");
const { verifygameToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/login", ingameController.gameUserLogin);
router.post("/add-coin", verifygameToken , ingameController.addCoins);
router.get("/my-coin", verifygameToken, ingameController.getUserCoins);
router.post("/update" , verifygameToken, ingameController.updateCoinUsage);
router.get("/details/:userId/:gameId", ingameController.getGameCoinAndUserInfo);
router.post("/create-order", ingameController.createCoinOrder);
router.post("/payment-callback", ingameController.confirmCoinPayment);
router.get("/confirm", ingameController.confirmCoinPayment);

module.exports = router;
