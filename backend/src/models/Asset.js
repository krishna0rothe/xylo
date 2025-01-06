// models/Asset.js

const mongoose = require("mongoose");

const AssetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tags: {
      type: [String], // Array of tags to help with filtering and searching
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    fileLocation: {
      type: String, // Location of the uploaded file (if applicable)
      required: true,
    },
    previewImages: {
      type: [String], // Array of URLs for preview images
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Studio", // The studio that uploaded the asset
      required: true,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

module.exports = mongoose.model("Asset", AssetSchema);
