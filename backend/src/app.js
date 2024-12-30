const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const studioRoutes = require("./routes/studio.Routes"); // Adjust the path as necessary
const userRoutes = require("./routes/user.Routes"); // Adjust the path as necessary
const authRoutes = require("./routes/auth.Routes"); // Adjust the path as necessary

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api/studio", studioRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
