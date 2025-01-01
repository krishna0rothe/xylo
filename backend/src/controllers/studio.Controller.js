const bcrypt = require("bcrypt");
const Studio = require("../models/Studio"); // Adjust the path as necessary
const Game = require("../models/Game"); // Adjust the path as necessary
const File = require("../models/File"); // Adjust the path as necessary
const Sell = require("../models/Sell"); // Adjust the path as necessary


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

exports.getGamesByStudio = async (req, res) => {
  const studioId = req.user._id; // Middleware adds studio ID to req.user

  try {
    // Find all games created by the studio
    const games = await Game.find({ createdBy: studioId }).select(
      "name description images platform category price version tags file"
    );

    if (!games || games.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "No games found for this studio" });
    }

    // Populate file details for each game
    const gamesWithFile = await Promise.all(
      games.map(async (game) => {
        const file = game.file ? await File.findById(game.file) : null;
        return {
          _id: game._id,
          name: game.name,
          description: game.description,
          images: game.images,
          platform: game.platform,
          category: game.category,
          price: game.price,
          version: game.version,
          tags: game.tags,
          file: file || null, // Include file or null if not available
        };
      })
    );

    res.status(200).json({
      status: "success",
      message: "Games fetched successfully",
      data: gamesWithFile,
    });
  } catch (error) {
    console.error("Error fetching games for studio:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};


exports.getStudioAnalytics = async (req, res) => {
  const studioId = req.user._id; // Middleware sets the studio ID

  try {
    // Step 1: Fetch all games published by the studio
    const games = await Game.find({ createdBy: studioId });
    const gameIds = games.map((game) => game._id);
    const totalGamesPublished = games.length;

    // Step 2: Aggregate total downloads and revenue
    const downloadAndRevenueAggregation = await Sell.aggregate([
      { $match: { game: { $in: gameIds } } }, // Match sales related to studio's games
      {
        $group: {
          _id: null,
          totalDownloads: { $sum: 1 }, // Each sale represents one download
          totalRevenue: { $sum: "$amount" }, // Sum of all revenue
        },
      },
    ]);

    const totalDownloads =
      downloadAndRevenueAggregation[0]?.totalDownloads || 0;
    const totalRevenue = downloadAndRevenueAggregation[0]?.totalRevenue || 0;

    // Step 3: Group downloads and revenue by day
    const downloadsByDay = await Sell.aggregate([
      { $match: { game: { $in: gameIds } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          downloads: { $sum: 1 }, // Each sale represents one download
        },
      },
      { $sort: { _id: 1 } }, // Sort by date ascending
    ]);

    const revenueByDay = await Sell.aggregate([
      { $match: { game: { $in: gameIds } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } }, // Sort by date ascending
    ]);

    // Format the analytics for response
    const formattedDownloadsByDay = downloadsByDay.map((entry) => ({
      date: entry._id,
      downloads: entry.downloads,
    }));

    const formattedRevenueByDay = revenueByDay.map((entry) => ({
      date: entry._id,
      revenue: entry.revenue,
    }));

    // Step 4: Return the analytics
    res.status(200).json({
      status: "success",
      summary: {
        totalDownloads,
        totalRevenue,
        totalGamesPublished,
      },
      analytics: {
        downloadsByDay: formattedDownloadsByDay,
        revenueByDay: formattedRevenueByDay,
      },
    });
  } catch (error) {
    console.error("Error fetching studio analytics:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};
