const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Secret key for JWT
const SECRET_KEY = "your_secret_key";

// Hardcoded user ID
const USER_ID = "12345";

// In-memory store for used tokens
const usedTokens = new Set();

/**
 * @route GET /generate-token
 * @desc Generates a single-use JWT token
 */
router.get("/generate-token", (req, res) => {
  try {
    const token = jwt.sign({ userId: USER_ID }, SECRET_KEY, {
      expiresIn: "1h", // Token validity: 1 hour
    });

    res.status(200).json({
      status: "success",
      message: "Token generated successfully.",
      token,
    });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to generate token.",
    });
  }
});

/**
 * @route POST /validate-token
 * @desc Validates the provided token
 */
router.post("/validate-token", (req, res) => {
  const { token } = req.body;

  try {
    // Check if the token is provided
    if (!token) {
      return res.status(400).json({
        status: "error"
 
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);

    // Check if the token has already been used
    if (usedTokens.has(token)) {
      return res.status(400).json({
        status: "error"

      });
    }

    // Validate the user ID
    if (decoded.userId !== USER_ID) {
      return res.status(403).json({
        status: "error"

      });
    }

    // Mark the token as used
    usedTokens.add(token);

    res.status(200).json({
      status: "success"

    });
  } catch (error) {
    console.error("Error validating token:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error"

      });
    }

    res.status(400).json({
      status: "error"

    });
  }
});

module.exports = router;
