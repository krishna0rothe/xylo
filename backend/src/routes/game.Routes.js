const express = require("express");
const gameController = require("../controllers/game.Controller");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

// Route to get all games or filter by category
router.get("/games", gameController.getPaginatedGames);
router.post("/add-discount/:gameId", verifyToken, gameController.addDiscountToGame);
router.post("/add-review/:gameId/",  gameController.addReviewToGame);
router.get("/games/:gameId",  gameController.getGameById);

module.exports = router;
