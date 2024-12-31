const Game = require("../models/Game");

// GET endpoint to fetch games with optional category filter
exports.getGames = async (req, res) => {
  const { category } = req.query; // Extract category from query parameters

  try {
    // If a category is provided, filter by category; otherwise, fetch all games
    let games;
    if (category) {
      // Fetch games that match the category and populate the createdBy field (for studio details)
      games = await Game.find({ category: category }).populate(
        "createdBy",
        "name logo"
      );
    } else {
      // Fetch all games if no category is provided and populate the createdBy field (for studio details)
      games = await Game.find({}).populate("createdBy", "name logo");
    }

    // Format the response to include only the required fields
    const formattedGames = games.map((game) => ({
      _id: game._id,
      name: game.name,
      description: game.description,
      images: game.images,
      platform: game.platform,
      category: game.category,
      price: game.price,
      file: game.file, // The file ID, which will be populated later if needed
      req: game.req,
      version: game.version,
      studio: {
        name: game.createdBy.name,
        logo: game.createdBy.logo,
      },
    }));

    // Return the games in the response
    res.status(200).json({
      status: "success",
      message: "Games retrieved successfully",
      games: formattedGames, // The list of formatted games
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.getPaginatedGames = async (req, res) => {
  const { page = 1, limit = 20, category } = req.query; // Extract query params, with defaults for page and limit

  try {
    // Build a filter query to match the category with tags if provided
    const filter = category
      ? { tags: { $regex: new RegExp(category, "i") } }
      : {};

    // Calculate the total number of games matching the filter
    const totalGames = await Game.countDocuments(filter);

    // Fetch paginated games with the required fields and populate the studio details
    const games = await Game.find(filter)
      .populate("createdBy", "name logo") // Populate studio details (name and logo)
      .skip((page - 1) * limit) // Skip games for previous pages
      .limit(Number(limit)); // Limit the number of games for the current page

    // Format the response
    const formattedGames = games.map((game) => ({
      _id: game._id,
      name: game.name,
      description: game.description,
      images: game.images,
      platform: game.platform,
      category: game.category,
      price: game.price,
      file: game.file, // The file ID
      req: game.req,
      version: game.version,
      studio: {
        name: game.createdBy.name,
        logo: game.createdBy.logo,
      },
    }));

    // Return paginated games in the response
    res.status(200).json({
      status: "success",
      message: "Games retrieved successfully",
      totalGames, // Total count of games matching the filter
      currentPage: Number(page),
      totalPages: Math.ceil(totalGames / limit),
      games: formattedGames, // List of formatted games
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
};