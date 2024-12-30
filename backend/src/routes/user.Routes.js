const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.Controller');

router.post("/register", userController.registerUser);

module.exports = router;