const express = require("express");
const gameController = require("../controllers/game.Controller");
const router = express.Router();

// Route to get all games or filter by category
router.get("/games", gameController.getPaginatedGames);

module.exports = router;
