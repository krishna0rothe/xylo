const express = require('express');
const router = express.Router();
const studioController = require('../controllers/studio.Controller');

router.post("/register", studioController.registerStudio);

module.exports = router;