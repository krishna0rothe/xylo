const bcrypt = require("bcrypt");
const Studio = require("../models/Studio"); // Adjust the path as necessary
const Game = require("../models/Game"); // Adjust the path as necessary
const File = require("../models/File"); // Adjust the path as necessary


// Register Controller
exports.registerStudio = async (req, res) => {
  try {
    const { name, email, password, country, website, bio, logo, socialLinks } =
      req.body;

    // Check if all required values are provided
    if (!name || !email || !password || !country) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "All required fields must be provided",
        });
    }

    // Check if the email already exists
    const existingStudio = await Studio.findOne({ email });
    if (existingStudio) {
      return res
        .status(400)
        .json({ status: "error", message: "Email already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new Studio document
    const studio = new Studio({
      name,
      email,
      password: hashedPassword,
      country,
      website,
      bio,
      logo,
      socialLinks,
    });

    // Save the studio to the database
    await studio.save();

    // Send success response
    res.status(201).json({
      status: "success",
      message: "Studio registered successfully",
      studio: { _id: studio._id, name: studio.name, email: studio.email }, // Include only necessary fields
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error", error });
  }
};

// Controller to add a new game
exports.addGame = async (req, res) => {
  try {
    // Extract the studioId from the user object in the middleware (from req.user)
    const studioId = req.user._id; // studioId will be added to the game as createdBy

    // Validate if required fields are present
    const { name, description, images, platform, category, price, req: systemRequirements, tags, version } = req.body;

    // Check if all required fields are provided
    if (!name || !description || !platform || !category || !version) {
      return res.status(400).json({ status: 'error', message: 'All required fields must be provided' });
    }

    // Create the new game
    const newGame = new Game({
      name,
      createdBy: studioId, // Studio ID from middleware
      description,
      images,
      platform,
      category,
      price,
      req: systemRequirements, // System requirements (min and max)
      tags,
      version,
    });

    // Save the game to the database
    await newGame.save();

    // Respond with success
    res.status(201).json({
      status: 'success',
      message: 'Game added successfully',
      game: {
        _id: newGame._id,
        name: newGame.name,
        createdBy: studioId, // Studio ID
        description: newGame.description,
        platform: newGame.platform,
        category: newGame.category,
        price: newGame.price,
        req: newGame.req,
        tags: newGame.tags,
        version: newGame.version,
        createdAt: newGame.createdAt,
        updatedAt: newGame.updatedAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Server error, please try again later' });
  }
};
