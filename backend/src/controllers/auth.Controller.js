const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Studio = require("../models/Studio"); // Adjust the path as necessary

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "error", message: "Email and password are required" });
    }

    // Check if the email exists in the Studio model
    let user = await Studio.findOne({ email });

    // If not found in Studio, check the User model
    if (!user) {
      user = await User.findOne({ email });
    }

    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "User not found" });
    }

    // Check if the provided password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid credentials" });
    }

    // Create a JWT token
    const payload = {
      _id: user._id,
      role: user.constructor.modelName === "Studio" ? "studio" : "user", // Determine role based on model
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    }); // Replace 'yourSecretKey' with a secure key

    // Send success response with token
    res.status(200).json({
      status: "success",
      message: "Login successful",
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error", error });
  }
};

// Controller to get the studio or user based on the ID in the token
exports.getStudioOrUser = async (req, res) => {
    const userId = req.user._id; // Get the ID from the middleware (extracted from JWT)

    try {
        // Try to find the studio by the given ID
        const studio = await Studio.findById(userId);
        if (studio) {
            return res.status(200).json({
                status: 'success',
                data: {
                    _id: studio._id,
                    name: studio.name,
                    email: studio.email,
                    country: studio.country,
                    logo: studio.logo, // Adding logo field for studio
                    role : 'studio',
                    createdAt: studio.createdAt,
                    updatedAt: studio.updatedAt,
                },
            });
        }

        // If the studio doesn't exist, try to find the user by the given ID
        const user = await User.findById(userId);
        if (user) {
            return res.status(200).json({
                status: 'success',
                data: {
                    name: user.name,
                    email: user.email,
                    country: user.country,
                    logo: user.profilePicture, // Treating the profile picture as logo
                    role: 'user',
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            });
        }

        // If neither a studio nor user is found
        return res.status(404).json({
            status: 'error',
            message: 'Studio or User not found',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
};