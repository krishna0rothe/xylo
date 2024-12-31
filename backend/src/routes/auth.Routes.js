const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.Controller');
const { verifyToken } = require("../middlewares/authMiddleware");   

router.post("/login", authController.login);
router.get("/me", verifyToken, authController.getStudioOrUser);

module.exports = router;