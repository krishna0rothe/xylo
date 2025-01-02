// controllers/assetsController.js
const Asset = require("../models/Asset");
const fs = require("fs");
const path = require("path");
const AssetSales = require("../models/AssetSales");



exports.addAsset = async (req, res) => {
  try {
    // Extract the studioId from the user object in the middleware (from req.user)
    const studioId = req.user._id;

    // Validate if required fields are present
    const { title, description, category, tags, price, previewImages } =
      req.body;

    if (
      !title ||
      !description ||
      !category ||
      !tags ||
      !price ||
      !previewImages
    ) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "All required fields must be provided",
        });
    }

    const tagsArray = tags.split(",");

    // Convert previewImages to an array if it's a string (comma-separated)
    let previewImageUrls = [];
    if (typeof previewImages === "string") {
      previewImageUrls = previewImages.split('","').map(url => url.replace(/^"|"$/g, ''));
    } else if (Array.isArray(previewImages)) {
      previewImageUrls = previewImages; // Use the array directly if already in array format
    }

    // Ensure file exists before saving the fileLocation
    if (!req.file) {
      return res
        .status(400)
        .json({ status: "error", message: "File is required for the asset" });
    }

    // Create the new asset
    const newAsset = new Asset({
      title,
      description,
      category,
      tags: tagsArray,
      price: parseFloat(price),
      fileLocation: req.file.path, // File location stored
      previewImages: previewImageUrls, // Preview images URLs
      author: studioId, // Studio ID from middleware
    });

    // Save the asset to the database
    await newAsset.save();

    // Respond with success
    res.status(201).json({
      status: "success",
      message: "Asset added successfully",
      asset: {
        _id: newAsset._id,
        title: newAsset.title,
        description: newAsset.description,
        category: newAsset.category,
        tags: newAsset.tags,
        price: newAsset.price,
        previewImages: newAsset.previewImages,
        author: studioId, // Author of the asset (studio)
        createdAt: newAsset.createdAt,
        updatedAt: newAsset.updatedAt,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        status: "error",
        message: "Server error, please try again later",
      });
  }
};

exports.getAllAssets = async (req, res) => {
  try {
    // Fetch all assets from the database
    const assets = await Asset.find();

    // Check if there are any assets
    if (!assets.length) {
      return res
        .status(404)
        .json({ status: "error", message: "No assets found" });
    }

    // Return the assets in the response
    res.status(200).json({
      status: "success",
      assets,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        status: "error",
        message: "Server error, please try again later",
      });
  }
};


exports.getAssetsByCategory = async (req, res) => {
  const { category } = req.params; // Get category from request parameters

  try {
    // Fetch assets based on the category
    const assets = await Asset.find({ category });

    // Check if any assets were found for the category
    if (!assets.length) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "No assets found for this category",
        });
    }

    // Return the assets in the response
    res.status(200).json({
      status: "success",
      assets,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        status: "error",
        message: "Server error, please try again later",
      });
  }
};


exports.downloadAssetFile = async (req, res) => {
  try {
    const { assetId } = req.params; // Asset ID from URL parameter

    // Find the asset in the database
    const asset = await Asset.findById(assetId);

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    // Get the file path from the asset document
    const fileLocation = asset.fileLocation;

    // Check if the file exists at the specified location
    if (!fs.existsSync(fileLocation)) {
      return res.status(404).json({ message: "File not found" });
    }

    // Set the response headers for file download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${path.basename(fileLocation)}"`
    );
    res.setHeader("Content-Type", "application/octet-stream");

    // Create a read stream and pipe it to the response
    const fileStream = fs.createReadStream(fileLocation);
    fileStream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller function to get all assets created by a specific creator
exports.getAssetsByCreator = async (req, res) => {
  try {
    const creatorId = req.user._id; // The creator ID is injected by the middleware

    if (!creatorId) {
      return res.status(400).json({ status: 'error', message: 'Creator ID is missing' });
    }

    // Find all assets created by the given creator ID
    const assets = await Asset.find({ author: creatorId });

    if (!assets.length) {
      return res.status(404).json({ status: 'error', message: 'No assets found for this creator' });
    }

    // Return the assets
    res.status(200).json({
      status: 'success',
      message: 'Assets retrieved successfully',
      data: assets,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};


exports.getRevenueAndDownloadStats = async (req, res) => {
  try {
    const creatorId = req.user._id; // Injected by middleware

    if (!creatorId) {
      return res
        .status(400)
        .json({ status: "error", message: "Creator ID is missing" });
    }

    // Fetch all assets created by the creator
    const assets = await Asset.find({ author: creatorId });
    const assetIds = assets.map((asset) => asset._id);

    // Key metrics
    const totalAssets = assets.length;

    // Aggregate sales data
    const salesData = await AssetSales.aggregate([
      { $match: { asset: { $in: assetIds } } }, // Match only the creator's assets
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Group by date
          totalRevenue: { $sum: "$amount" },
          totalDownloads: { $sum: 1 }, // Count each sale as one download
        },
      },
      { $sort: { _id: 1 } }, // Sort by date ascending
    ]);

    // Calculate total revenue and total downloads
    const totalRevenue = salesData.reduce(
      (sum, day) => sum + day.totalRevenue,
      0
    );
    const totalDownloads = salesData.reduce(
      (sum, day) => sum + day.totalDownloads,
      0
    );

    // Format graph data
    const graphData = salesData.map((day) => ({
      date: day._id,
      totalRevenue: day.totalRevenue,
      totalDownloads: day.totalDownloads,
    }));

    // Response
    res.status(200).json({
      status: "success",
      message: "Revenue and download statistics retrieved successfully",
      data: {
        totalAssets,
        totalRevenue,
        totalDownloads,
        graphData,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};