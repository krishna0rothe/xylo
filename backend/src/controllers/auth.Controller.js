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
