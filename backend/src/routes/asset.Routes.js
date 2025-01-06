// routes/assetsRoutes.js

const express = require("express");
const router = express.Router();
const assetController = require("../controllers/asset.Controller");
const upload = require("../middlewares/uploadMiddleware"); // Import the multer middleware
const { verifyToken } = require("../middlewares/authMiddleware");

// POST route to add asset (with file upload)
router.post("/add", verifyToken, upload.single("assetFile"), assetController.addAsset);
router.get("/all", assetController.getAllAssets);
router.get("/category/:category", assetController.getAssetsByCategory);
router.get("/download/:assetId", assetController.downloadAssetFile);
router.get("/my-assets", verifyToken, assetController.getAssetsByCreator);
router.get("/my-stats" , verifyToken, assetController.getRevenueAndDownloadStats);


module.exports = router;
