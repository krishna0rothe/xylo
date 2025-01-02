const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Studio = require("../models/Studio"); // Adjust the path as necessary

// Middleware to verify JWT token and attach user info and role to req.user
exports.verifyToken = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ status: "error", message: "No token, authorization denied" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace 'yourSecretKey' with a secure key

    // Find user based on the role from the decoded token
    let user;

    if (decoded.role === "studio") {
      user = await Studio.findById(decoded._id);
    } else if (decoded.role === "user") {
      user = await User.findById(decoded._id);
    }

    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "User not found" });
    }

    // Attach both the user data and role to req.user
    req.user = {
      _id: decoded._id,
      role: decoded.role,
      data: user, // This contains the user or studio data
    };

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error(error);
    res.status(401).json({ status: "error", message: "Token is not valid" });
  }
};

// Middleware to check the role of the user
exports.checkRole = (role) => {
  return (req, res, next) => {
    // Check if the user's role matches the required role
    if (req.user.role !== role) {
      return res.status(403).json({ status: 'error', message: 'Access denied. Insufficient role' });
    }
    next(); // Proceed to the next middleware or route handler
  };
};
