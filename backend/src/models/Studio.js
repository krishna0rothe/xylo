const mongoose = require("mongoose");

const studioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  website: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  logo: {
    type: String, // This can store the URL or path to the logo image
  },
  socialLinks: {
    type: Map,
    of: String, // Key-value pairs for social links (e.g., "twitter": "https://twitter.com/studio")
  },
  verificationStatus: {
    type: Boolean,
    default: false,
  },
  totalGames: {
    type: Number,
    default: 0,
  },
});

const Studio = mongoose.model("Studio", studioSchema);

module.exports = Studio;
