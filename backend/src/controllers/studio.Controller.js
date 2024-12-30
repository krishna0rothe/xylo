const bcrypt = require("bcrypt");
const Studio = require("../models/Studio"); // Adjust the path as necessary

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
