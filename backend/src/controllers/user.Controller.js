const bcrypt = require("bcrypt");
const User = require("../models/User"); // Adjust the path as necessary

// Register Controller
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, profilePicture } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "All required fields must be provided",
        });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "error", message: "Email already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new User document
    const user = new User({
      name,
      email,
      password: hashedPassword,
      profilePicture,
    });

    // Save the user to the database
    await user.save();

    // Send success response
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      user: { _id: user._id, name: user.name, email: user.email }, // Include only necessary fields
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error", error });
  }
};
