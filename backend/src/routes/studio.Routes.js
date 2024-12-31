const express = require('express');
const router = express.Router();
const studioController = require('../controllers/studio.Controller');
const { verifyToken, checkRole } = require("../middlewares/authMiddleware");

router.post("/register", studioController.registerStudio);
router.post("/add-game", verifyToken, checkRole("studio"), studioController.addGame);

module.exports = router;