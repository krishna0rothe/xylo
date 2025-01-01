const Game = require("../models/Game");
const GameMetadata = require("../models/GameMetadata");
const Review = require("../models/Review");
const File = require("../models/File");
const Studio = require("../models/Studio");
const User = require("../models/User"); 

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


exports.addDiscountToGame = async (req, res) => {
  const { gameId } = req.params; // Extract the game ID from the request parameters
  const { discountPercentage } = req.body; // Extract the discount percentage from the request body

  try {
    // Validate the discount percentage
    if (discountPercentage < 0 || discountPercentage > 100) {
      return res.status(400).json({
        status: "error",
        message: "Discount percentage must be between 0 and 100",
      });
    }

    // Check if the game exists in the database
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({
        status: "error",
        message: "Game not found",
      });
    }

    // Find the GameMetadata or create it if not found
    let gameMetadata = await GameMetadata.findOne({ game: gameId });

    if (!gameMetadata) {
      // Create new metadata for the game
      gameMetadata = new GameMetadata({
        game: gameId,
        discountPercentage,
      });
    } else {
      // Update the existing metadata with the new discount percentage
      gameMetadata.discountPercentage = discountPercentage;
    }

    // Save the GameMetadata to the database
    const savedMetadata = await gameMetadata.save();

    // Respond with the updated metadata
    res.status(200).json({
      status: "success",
      message: "Discount updated successfully",
      metadata: savedMetadata,
    });
  } catch (error) {
    console.error("Error updating discount:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while updating the discount",
    });
  }
};

exports.addReviewToGame = async (req, res) => {
  const { gameId } = req.params; // Extract the game ID from the request parameters
  const { rating, comment } = req.body; // Extract the rating and comment from the request body
  const userId = req.user._id; // Get user ID from the request (assumed added by authentication middleware)
  try {
    // Check if the game exists in the database
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({
        status: "error",
        message: "Game not found",
      });
    }

    // Create a new review
    const newReview = new Review({
      game: gameId,
      user: userId,
      rating,
      comment,
    });

    // Save the review to the database
    const savedReview = await newReview.save();

    // Find the GameMetadata for the game or create it if not found
    let gameMetadata = await GameMetadata.findOne({ game: gameId });

    if (!gameMetadata) {
      // Create new metadata for the game
      gameMetadata = new GameMetadata({
        game: gameId,
        reviews: [savedReview._id],
      });
    } else {
      // Add the review ID to the reviews array in the metadata
      gameMetadata.reviews.push(savedReview._id);
    }

    // Save the updated or newly created metadata
    await gameMetadata.save();

    // Respond with the saved review
    res.status(201).json({
      status: "success",
      message: "Review added successfully",
      review: savedReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while adding the review",
    });
  }
};


exports.getGameById = async (req, res) => {
  const { gameId } = req.params; // Get game ID from request parameters

  try {
    // Find the game by its ID
    const game = await Game.findById(gameId);
    if (!game) {
      return res
        .status(404)
        .json({ status: "error", message: "Game not found" });
    }

    // Fetch studio details using the createdBy field in the game
    const studio = await Studio.findById(game.createdBy);
    if (!studio) {
      return res
        .status(404)
        .json({ status: "error", message: "Studio not found" });
    }

    // Fetch file details using the file field in the game
    const file = game.file ? await File.findById(game.file) : null;

    // Fetch game metadata
    const gameMetadata = await GameMetadata.findOne({ game: gameId });
    if (!gameMetadata) {
      return res
        .status(404)
        .json({ status: "error", message: "Game metadata not found" });
    }

    // Fetch reviews and user details for each review
    const reviews = await Review.find({ _id: { $in: gameMetadata.reviews } });

    // Map reviews to include reviewer details (user name)
    const reviewDetails = await Promise.all(
      reviews.map(async (review) => {
        const reviewer = await User.findById(review.user);
        return {
          id: review._id,
          rating: review.rating,
          comment: review.comment,
          reviewerName: reviewer ? reviewer.name : "Anonymous", // Fallback to "Anonymous" if user not found
        };
      })
    );

    // Prepare the game details response
    const response = {
      id: game._id,
      name: game.name,
      description: game.description,
      images: game.images,
      platform: game.platform,
      category: game.category,
      price: game.price,
      tags: game.tags,
      version: game.version,
      requirements: game.req,
      studioName: studio.name,
      studioLogo: studio.logo,
      file: file
        ? { id: file._id, type: file.type, location: file.location }
        : null,
      metadata: {
        rating: gameMetadata.rating,
        totalDownloads: gameMetadata.numberOfDownloads,
        reviews: reviewDetails,
      },
    };

    // Return the game details in the response
    res.status(200).json({ status: "success", game: response });
  } catch (error) {
    console.error("Error fetching game:", error);
    res
      .status(500)
      .json({
        status: "error",
        message: "An error occurred while fetching the game details",
      });
  }
};




