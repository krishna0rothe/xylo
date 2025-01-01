const express = require("express");
const gameController = require("../controllers/game.Controller");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

// Route to get all games or filter by category
router.get("/games", gameController.getPaginatedGames);
router.get("/games/:gameId", gameController.getGameById);
router.post("/add-review/:gameId/", verifyToken , gameController.addReviewToGame);
router.post("/add-discount/:gameId", verifyToken, gameController.addDiscountToGame);


module.exports = router;
