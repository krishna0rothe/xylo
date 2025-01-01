// controllers/assetsController.js

const Asset = require("../models/Asset");
const path = require("path");
const fs = require("fs");

// Create Asset (upload)
exports.createAsset = async (req, res) => {
  try {
    const { title, description, category, tags, price, previewImage } =
      req.body;

    // Ensure the file is uploaded
    if (!req.file) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "File is required for asset upload.",
        });
    }

    // Prepare an array for preview images
    let previewImages = [];
    if (req.files && req.files.length > 0) {
      previewImages = req.files.map((file) =>
        path.join(__dirname, "../../", "uploads/assets", file.filename)
      );
    }

    // Create a new asset document
    const newAsset = new Asset({
      title,
      description,
      category,
      tags: tags.split(","), // Convert comma-separated tags into an array
      price: parseFloat(price),
      fileLocation: path.join(
        __dirname,
        "../../",
        "uploads/assets",
        req.file.filename
      ), // File path
      previewImages,
      author: req.user._id, // Assuming the user ID is available in `req.user._id` from the middleware
    });

    await newAsset.save();
    res.status(201).json({ status: "success", asset: newAsset });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Error uploading asset", error });
  }
};

// Get All Assets (list)
exports.getAllAssets = async (req, res) => {
  try {
    // Retrieve all assets from the database
    const assets = await Asset.find().populate("author", "name"); // Populate the author name for each asset
    res.status(200).json({ status: "success", assets });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Error fetching assets", error });
  }
};
